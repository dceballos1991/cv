import React from "react";
import {
  formatInvoiceDate,
  formatMoney,
  formatPercent,
  formatQuantity,
  type InvoiceDraft,
  type InvoiceTotals,
} from "@/lib/invoice";

type InvoiceDocumentProps = {
  draft: InvoiceDraft;
  totals: InvoiceTotals;
};

export function InvoiceDocument({ draft, totals }: InvoiceDocumentProps) {
  const money = (amount: number) => formatMoney(amount, draft.currency);

  const metaRows = [
    draft.date ? { label: "Date", value: formatInvoiceDate(draft.date) } : null,
    draft.paymentTerms
      ? { label: "Payment Terms", value: draft.paymentTerms }
      : null,
    draft.dueDate
      ? { label: "Due Date", value: formatInvoiceDate(draft.dueDate) }
      : null,
    draft.poNumber ? { label: "PO Number", value: draft.poNumber } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  const discountLabel =
    totals.discountPercent === null
      ? "Discount"
      : `Discount (${formatPercent(totals.discountPercent)}%)`;
  const taxLabel =
    totals.taxPercent === null
      ? "Tax"
      : `Tax (${formatPercent(totals.taxPercent)}%)`;

  return (
    <article
      className="invoice-sheet box-border min-h-[11in] w-[8.5in] border border-muted bg-white p-12 text-foreground print:border-0 print:p-10"
      id="invoice-sheet"
    >
      <header className="flex items-start justify-between gap-6">
        <div className="max-w-[48%] whitespace-pre-line pt-1 text-base font-semibold leading-snug print:text-[12px]">
          {draft.logo ? (
            // Data URLs from the logo picker are not a static next/image source.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={draft.logo}
              alt=""
              className="mb-2 block max-h-16 max-w-[180px] object-contain"
            />
          ) : null}
          {draft.from}
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold leading-none print:text-[18px]">
            Invoice
          </h1>
          <p className="mt-1.5 font-mono text-sm text-muted-foreground print:text-[12px]">
            # {draft.number}
          </p>
        </div>
      </header>

      <section className="mt-10 flex items-start justify-between gap-6 print:mt-6">
        <div className="flex min-w-0 flex-1 gap-8 pt-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground print:text-[10px]">
              Bill To
            </p>
            <p className="mt-1 whitespace-pre-line text-base font-semibold leading-snug print:text-[12px]">
              {draft.billTo}
            </p>
          </div>
          {draft.shipTo.trim() ? (
            <div>
              <p className="font-mono text-xs text-muted-foreground print:text-[10px]">
                Ship To
              </p>
              <p className="mt-1 whitespace-pre-line text-base font-semibold leading-snug print:text-[12px]">
                {draft.shipTo}
              </p>
            </div>
          ) : null}
        </div>

        <div className="w-[46%] shrink-0 font-mono text-sm print:text-[12px]">
          {metaRows.map((row) => (
            <div className="flex justify-between gap-4 py-0.5" key={row.label}>
              <span className="text-muted-foreground">{row.label}</span>
              <span className="text-right tabular-nums text-gray-500">
                {row.value}
              </span>
            </div>
          ))}
          <div className="mt-2 flex justify-between gap-4 rounded-md bg-secondary px-3 py-1.5 font-semibold text-secondary-foreground">
            <span>Balance Due</span>
            <span className="tabular-nums">{money(totals.balanceDue)}</span>
          </div>
        </div>
      </section>

      <div className="mt-8 overflow-hidden rounded-md border border-muted print:mt-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary font-mono text-xs text-secondary-foreground print:text-[10px]">
              <th className="px-3 py-2 text-left font-semibold">Item</th>
              <th className="w-[15%] px-3 py-2 text-right font-semibold">
                Quantity
              </th>
              <th className="w-[16%] px-3 py-2 text-right font-semibold">
                Rate
              </th>
              <th className="w-[18%] px-3 py-2 text-right font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {totals.lines.map((line) => (
              <tr key={line.id}>
                <td className="whitespace-pre-line px-3 py-3 text-left text-sm font-semibold print:py-2 print:text-[12px]">
                  {line.description}
                </td>
                <td className="px-3 py-3 text-right font-mono text-sm tabular-nums text-gray-500 print:py-2 print:text-[12px]">
                  {formatQuantity(line.quantity)}
                </td>
                <td className="px-3 py-3 text-right font-mono text-sm tabular-nums text-gray-500 print:py-2 print:text-[12px]">
                  {money(line.rate)}
                </td>
                <td className="px-3 py-3 text-right font-mono text-sm tabular-nums text-gray-500 print:py-2 print:text-[12px]">
                  {money(line.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ml-auto mt-8 w-[46%] space-y-1 font-mono text-sm print:mt-6 print:text-[12px]">
        <TotalRow label="Subtotal" value={money(totals.subtotal)} />
        {totals.showDiscount ? (
          <TotalRow label={discountLabel} value={money(-totals.discount)} />
        ) : null}
        {totals.showTax ? (
          <TotalRow label={taxLabel} value={money(totals.tax)} />
        ) : null}
        {totals.showShipping ? (
          <TotalRow label="Shipping" value={money(totals.shipping)} />
        ) : null}
        <TotalRow label="Total" value={money(totals.total)} emphasis />
        {totals.showAmountPaid ? (
          <TotalRow label="Amount Paid" value={money(totals.amountPaid)} />
        ) : null}
      </div>

      {draft.notes.trim() ? (
        <section className="mt-10 print:mt-6">
          <p className="font-mono text-xs text-muted-foreground print:text-[10px]">
            Notes
          </p>
          <p className="mt-1 whitespace-pre-line font-mono text-sm text-muted-foreground print:text-[12px]">
            {draft.notes}
          </p>
        </section>
      ) : null}

      {draft.terms.trim() ? (
        <section className="mt-6">
          <p className="font-mono text-xs text-muted-foreground print:text-[10px]">
            Terms
          </p>
          <p className="mt-1 whitespace-pre-line font-mono text-sm text-muted-foreground print:text-[12px]">
            {draft.terms}
          </p>
        </section>
      ) : null}
    </article>
  );
}

function TotalRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        emphasis
          ? "flex justify-between gap-4 font-semibold text-foreground"
          : "flex justify-between gap-4"
      }
    >
      <span className={emphasis ? undefined : "text-muted-foreground"}>
        {label}
      </span>
      <span
        className={emphasis ? "tabular-nums" : "tabular-nums text-gray-500"}
      >
        {value}
      </span>
    </div>
  );
}
