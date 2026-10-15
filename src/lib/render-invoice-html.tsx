import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { InvoiceDocument } from "@/components/invoice/invoice-document";
import { calculateInvoice, type InvoiceDraft } from "@/lib/invoice";

export function renderInvoiceHtml(draft: InvoiceDraft, head: string): string {
  const totals = calculateInvoice(draft);
  const body = renderToStaticMarkup(
    <InvoiceDocument draft={draft} totals={totals} />,
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${escapeText(draft.number)}</title>
${head}
</head>
<body>
${body}
</body>
</html>
`;
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
