import type { AdjustmentMode, InvoiceDraft } from "@/lib/invoice";

export class InvoiceInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvoiceInputError";
  }
}

type Raw = Record<string, unknown>;

const BUILTIN_DEFAULTS = {
  from: "David Ceballos",
  currency: "USD",
  taxMode: "percent" as AdjustmentMode,
  taxValue: 0,
  discountMode: "off" as AdjustmentMode,
  discountValue: 0,
  shippingMode: "off" as const,
  shippingValue: 0,
  amountPaid: 0,
  paymentTerms: "",
  notes: "",
  terms: "",
  shipTo: "",
  dueDate: "",
  poNumber: "",
};

export function parseInvoiceJson(text: string): unknown {
  try {
    return JSON.parse(text.replace(/^\uFEFF/, ""));
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid JSON";
    throw new InvoiceInputError(`invalid JSON: ${message}`);
  }
}

export function invoiceFromInput(
  invoice: unknown,
  defaults: unknown = {},
): InvoiceDraft {
  const raw = asObject(invoice, "invoice");
  const base = asObject(defaults, "defaults");

  const items = raw.items;
  if (!Array.isArray(items) || items.length === 0) {
    throw new InvoiceInputError("items is required");
  }

  return {
    logo: optionalString(pick(raw, base, "logo"), "logo") || null,
    from: stringField(raw, base, "from", BUILTIN_DEFAULTS.from),
    billTo: requiredString(raw.billTo, "billTo"),
    shipTo: stringField(raw, base, "shipTo", BUILTIN_DEFAULTS.shipTo),
    number: requiredString(raw.number, "number"),
    date: dateField(raw.date, "date", true),
    paymentTerms: stringField(
      raw,
      base,
      "paymentTerms",
      BUILTIN_DEFAULTS.paymentTerms,
    ),
    dueDate: dateField(pick(raw, base, "dueDate"), "dueDate", false),
    poNumber: stringField(raw, base, "poNumber", BUILTIN_DEFAULTS.poNumber),
    currency: stringField(raw, base, "currency", BUILTIN_DEFAULTS.currency),
    taxMode: modeField(
      raw,
      base,
      "taxMode",
      ["off", "percent", "flat"] as const,
      BUILTIN_DEFAULTS.taxMode,
    ),
    taxValue: numberString(raw, base, "taxValue", BUILTIN_DEFAULTS.taxValue),
    discountMode: modeField(
      raw,
      base,
      "discountMode",
      ["off", "percent", "flat"] as const,
      BUILTIN_DEFAULTS.discountMode,
    ),
    discountValue: numberString(
      raw,
      base,
      "discountValue",
      BUILTIN_DEFAULTS.discountValue,
    ),
    shippingMode: modeField(
      raw,
      base,
      "shippingMode",
      ["off", "flat"] as const,
      BUILTIN_DEFAULTS.shippingMode,
    ),
    shippingValue: numberString(
      raw,
      base,
      "shippingValue",
      BUILTIN_DEFAULTS.shippingValue,
    ),
    amountPaid: amountPaidField(raw, base),
    notes: stringField(raw, base, "notes", BUILTIN_DEFAULTS.notes),
    terms: stringField(raw, base, "terms", BUILTIN_DEFAULTS.terms),
    items: items.map((item, index) => lineItem(item, index)),
  };
}

function lineItem(item: unknown, index: number): InvoiceDraft["items"][number] {
  const field = `items[${index}]`;
  const raw = asObject(item, field);
  const description = requiredString(raw.description, `${field}.description`);
  const quantity = requiredNumber(raw.quantity, `${field}.quantity`);
  const rate = requiredNumber(raw.rate, `${field}.rate`);
  return {
    id: `item-${index + 1}`,
    description,
    quantity: String(quantity),
    rate: String(rate),
  };
}

function asObject(value: unknown, field: string): Raw {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new InvoiceInputError(`${field} must be an object`);
  }
  return value as Raw;
}

function pick(raw: Raw, defaults: Raw, key: string): unknown {
  if (Object.prototype.hasOwnProperty.call(raw, key)) return raw[key];
  if (Object.prototype.hasOwnProperty.call(defaults, key)) return defaults[key];
  return undefined;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new InvoiceInputError(`${field} is required`);
  }
  return value.trim();
}

function optionalString(value: unknown, field: string): string {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") {
    throw new InvoiceInputError(`${field} must be a string`);
  }
  return value;
}

function stringField(
  raw: Raw,
  defaults: Raw,
  key: string,
  fallback: string,
): string {
  const value = pick(raw, defaults, key);
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") {
    throw new InvoiceInputError(`${key} must be a string`);
  }
  return value;
}

function dateField(value: unknown, field: string, required: boolean): string {
  if (value === undefined || value === null || value === "") {
    if (required) throw new InvoiceInputError(`${field} is required`);
    return "";
  }
  if (typeof value !== "string" || !isIsoDate(value)) {
    throw new InvoiceInputError(`${field} must be YYYY-MM-DD`);
  }
  return value;
}

function isIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function modeField<T extends string>(
  raw: Raw,
  defaults: Raw,
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const value = pick(raw, defaults, key);
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "string" && allowed.includes(value as T)) {
    return value as T;
  }
  const list = allowed.map((mode) => `"${mode}"`).join(" or ");
  throw new InvoiceInputError(`${key} must be ${list}`);
}

function numberString(
  raw: Raw,
  defaults: Raw,
  key: string,
  fallback: number,
): string {
  const value = pick(raw, defaults, key);
  if (value === undefined || value === null || value === "") {
    return String(fallback);
  }
  return String(requiredNumber(value, key));
}

function amountPaidField(raw: Raw, defaults: Raw): string {
  const value = pick(raw, defaults, "amountPaid");
  if (value === undefined || value === null || value === "") {
    return String(BUILTIN_DEFAULTS.amountPaid);
  }
  const amount = requiredNumber(value, "amountPaid");
  if (amount < 0) {
    throw new InvoiceInputError("amountPaid must be zero or greater");
  }
  return String(amount);
}

function requiredNumber(value: unknown, field: string): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const amount = Number(value.replace(/,/g, "").trim());
    if (Number.isFinite(amount)) return amount;
  }
  throw new InvoiceInputError(`${field} must be a number`);
}
