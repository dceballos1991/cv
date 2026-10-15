import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { calculateInvoice, formatMoney } from "@/lib/invoice";
import {
  InvoiceInputError,
  invoiceFromInput,
  parseInvoiceJson,
} from "@/lib/invoice-input";
import { renderInvoiceHtml } from "@/lib/render-invoice-html";

const LATIN_RANGE =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT_RANGE =
  "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";
const FONT_WEIGHTS = [400, 500, 600, 700];
const INVOICE_DIR = path.join("private", "invoices");

function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectRoot = findProjectRoot(process.cwd());
  const inputPath =
    args.input && args.input !== "-" ? path.resolve(args.input) : args.input;
  const rawText = readInput(inputPath);
  const defaultsPath = path.join(projectRoot, INVOICE_DIR, "defaults.json");
  const defaults = fs.existsSync(defaultsPath)
    ? parseInvoiceJson(fs.readFileSync(defaultsPath, "utf8"))
    : {};
  const draft = invoiceFromInput(parseInvoiceJson(rawText), defaults);
  const fromFile = Boolean(inputPath && inputPath !== "-");
  const baseDir = fromFile ? path.dirname(inputPath!) : process.cwd();
  draft.logo = embedLogo(draft.logo, baseDir, projectRoot);

  const outputPath = path.resolve(
    args.out ??
      path.join(
        fromFile
          ? path.dirname(inputPath!)
          : path.join(projectRoot, INVOICE_DIR),
        `${safeFileName(draft.number)}.pdf`,
      ),
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "invoice-"));
  try {
    const cssPath = path.join(tempDir, "invoice.css");
    compileCss(projectRoot, cssPath);
    copyFonts(projectRoot, tempDir);
    const html = renderInvoiceHtml(
      draft,
      `<link rel="stylesheet" href="invoice.css" />
<style>
${fontFaceCss()}
html, body { margin: 0; padding: 0; background: #fff; }
html { font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
@page { size: letter; margin: 0; }
</style>`,
    );
    const htmlPath = path.join(tempDir, "invoice.html");
    fs.writeFileSync(htmlPath, html);
    printPdf(htmlPath, outputPath);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  const totals = calculateInvoice(draft);
  const shown = path.relative(process.cwd(), outputPath) || outputPath;
  process.stdout.write(
    `${shown}  ${formatMoney(totals.balanceDue, draft.currency)}\n`,
  );
}

function parseArgs(argv: string[]) {
  let input: string | undefined;
  let out: string | undefined;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      process.stdout.write(helpText());
      process.exit(0);
    }
    if (arg === "--out") {
      out = nextValue(argv, index, "--out");
      index += 1;
      continue;
    }
    if (arg === "-") {
      input = "-";
      continue;
    }
    if (arg.startsWith("-")) {
      throw new InvoiceInputError(`unknown option ${arg}`);
    }
    if (input) throw new InvoiceInputError(`unexpected argument ${arg}`);
    input = arg;
  }
  if (!input && process.stdin.isTTY) {
    process.stderr.write(helpText());
    process.exit(1);
  }
  return { input, out };
}

function nextValue(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith("-")) {
    throw new InvoiceInputError(`${flag} requires a path`);
  }
  return value;
}

function helpText(): string {
  return `Usage: npm run invoice -- <invoice.json> [--out file.pdf]
       npm run invoice -- --out file.pdf -

Reads private/invoices/defaults.json, writes <number>.pdf next to the JSON file,
and prints the PDF path and balance due.
`;
}

function readInput(inputPath: string | undefined): string {
  if (!inputPath || inputPath === "-") {
    return fs.readFileSync(0, "utf8");
  }
  if (!fs.existsSync(inputPath)) {
    throw new InvoiceInputError(`file not found: ${inputPath}`);
  }
  return fs.readFileSync(inputPath, "utf8");
}

function findProjectRoot(start: string): string {
  let dir = path.resolve(start);
  while (true) {
    if (
      fs.existsSync(path.join(dir, "package.json")) &&
      fs.existsSync(path.join(dir, INVOICE_DIR, "defaults.json"))
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return path.resolve(start);
    dir = parent;
  }
}

function embedLogo(
  logo: string | null,
  baseDir: string,
  projectRoot: string,
): string | null {
  if (!logo) return null;
  if (
    logo.startsWith("data:") ||
    logo.startsWith("http://") ||
    logo.startsWith("https://")
  ) {
    return logo;
  }
  const candidates = [
    path.resolve(baseDir, logo),
    path.resolve(projectRoot, logo),
  ];
  const file = candidates.find((candidate) => fs.existsSync(candidate));
  if (!file) throw new InvoiceInputError(`logo file not found: ${logo}`);
  const extension = path.extname(file).slice(1).toLowerCase();
  const mime =
    extension === "svg"
      ? "image/svg+xml"
      : extension === "jpg" || extension === "jpeg"
        ? "image/jpeg"
        : extension === "webp"
          ? "image/webp"
          : "image/png";
  const data = fs.readFileSync(file).toString("base64");
  return `data:${mime};base64,${data}`;
}

function compileCss(projectRoot: string, cssPath: string) {
  const binary = path.join(projectRoot, "node_modules", ".bin", "tailwindcss");
  execFileSync(
    binary,
    [
      "-i",
      path.join(projectRoot, "src", "app", "globals.css"),
      "-o",
      cssPath,
      "--minify",
    ],
    { cwd: projectRoot, stdio: ["ignore", "ignore", "pipe"] },
  );
}

function copyFonts(projectRoot: string, tempDir: string) {
  const fontDir = path.join(
    projectRoot,
    "node_modules",
    "@fontsource",
    "inter",
    "files",
  );
  for (const weight of FONT_WEIGHTS) {
    for (const subset of ["latin", "latin-ext"]) {
      const fileName = `inter-${subset}-${weight}-normal.woff2`;
      const source = path.join(fontDir, fileName);
      if (!fs.existsSync(source)) {
        throw new InvoiceInputError(`font file not found: ${fileName}`);
      }
      fs.copyFileSync(source, path.join(tempDir, fileName));
    }
  }
}

function fontFaceCss(): string {
  return FONT_WEIGHTS.map((weight) => {
    return `@font-face{font-family:Inter;font-style:normal;font-weight:${weight};font-display:block;src:url("inter-latin-ext-${weight}-normal.woff2") format("woff2");unicode-range:${LATIN_EXT_RANGE};}
@font-face{font-family:Inter;font-style:normal;font-weight:${weight};font-display:block;src:url("inter-latin-${weight}-normal.woff2") format("woff2");unicode-range:${LATIN_RANGE};}`;
  }).join("\n");
}

function printPdf(htmlPath: string, outputPath: string) {
  const chrome = findChrome();
  try {
    execFileSync(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-pdf-header-footer",
        "--virtual-time-budget=10000",
        `--print-to-pdf=${outputPath}`,
        htmlPath,
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );
  } catch (error) {
    const stderr =
      error instanceof Error && "stderr" in error
        ? String((error as { stderr?: Buffer }).stderr ?? "")
        : "";
    throw new InvoiceInputError(
      `could not print PDF with ${chrome}${stderr ? `: ${stderr.trim()}` : ""}`,
    );
  }
  if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size < 1000) {
    throw new InvoiceInputError("PDF was not created");
  }
}

function findChrome(): string {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  for (const command of [
    "chromium",
    "chromium-browser",
    "google-chrome",
    "google-chrome-stable",
  ]) {
    const found = which(command);
    if (found) return found;
  }
  throw new InvoiceInputError(
    "Chrome or Chromium is required. Set CHROME_PATH to the binary.",
  );
}

function which(command: string): string | null {
  try {
    const found = execFileSync("which", [command], { encoding: "utf8" }).trim();
    return found || null;
  } catch {
    return null;
  }
}

function safeFileName(number: string): string {
  return number.replace(/[^\w.-]+/g, "-");
}

try {
  main();
} catch (error) {
  if (error instanceof InvoiceInputError) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
  throw error;
}
