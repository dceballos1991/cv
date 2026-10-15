"use client";

import { useMemo, useRef, useState } from "react";
import { Download, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InvoiceDocument } from "@/components/invoice/invoice-document";
import { cn } from "@/lib/utils";
import {
  CURRENCIES,
  PAYMENT_TERMS,
  SAMPLE_INVOICE,
  blankInvoice,
  calculateInvoice,
  formatMoney,
  lineAmount,
  type AdjustmentMode,
  type InvoiceDraft,
  type LineItem,
} from "@/lib/invoice";

const inputClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 font-mono text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

const textareaClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

export function InvoiceGenerator() {
  const [draft, setDraft] = useState<InvoiceDraft>(SAMPLE_INVOICE);
  const nextItemId = useRef(2);
  const totals = useMemo(() => calculateInvoice(draft), [draft]);

  function update<K extends keyof InvoiceDraft>(
    key: K,
    value: InvoiceDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addItem() {
    const id = `item-${nextItemId.current++}`;
    setDraft((current) => ({
      ...current,
      items: [
        ...current.items,
        { id, description: "", quantity: "1", rate: "" },
      ],
    }));
  }

  function removeItem(id: string) {
    setDraft((current) => {
      const items = current.items.filter((item) => item.id !== id);
      return {
        ...current,
        items: items.length
          ? items
          : [
              {
                id: `item-${nextItemId.current++}`,
                description: "",
                quantity: "",
                rate: "",
              },
            ],
      };
    });
  }

  function onLogoChange(file: File | undefined) {
    if (!file) {
      update("logo", null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update("logo", typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  }

  function downloadPdf() {
    const previousTitle = document.title;
    document.title = draft.number ? `Invoice ${draft.number}` : "Invoice";
    window.print();
    document.title = previousTitle;
  }

  return (
    <div className="invoice-app min-h-screen bg-background">
      <header className="invoice-app-chrome sticky top-0 z-20 border-b bg-background">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 md:px-16">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Invoice Generator</h1>
            <p className="font-mono text-sm text-muted-foreground">
              Balance due{" "}
              <span className="tabular-nums text-gray-500">
                {formatMoney(totals.balanceDue, draft.currency)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                nextItemId.current = 2;
                setDraft(blankInvoice());
              }}
            >
              New
            </Button>
            <Button type="button" onClick={downloadPdf}>
              <Download className="mr-2 size-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] items-start gap-8 px-4 py-8 md:px-16 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        <form
          className="invoice-app-chrome space-y-8"
          onSubmit={(event) => event.preventDefault()}
        >
          <Section title="From">
            <Field label="Your business details">
              <textarea
                className={textareaClass}
                rows={3}
                value={draft.from}
                placeholder="Name and address"
                onChange={(event) => update("from", event.target.value)}
              />
            </Field>
            <Field label="Logo">
              <input
                className="block w-full font-mono text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:font-mono file:text-xs file:font-semibold file:text-secondary-foreground"
                type="file"
                accept="image/*"
                onChange={(event) => onLogoChange(event.target.files?.[0])}
              />
            </Field>
            {draft.logo ? (
              <button
                type="button"
                className="font-mono text-xs text-muted-foreground underline-offset-4 hover:underline"
                onClick={() => update("logo", null)}
              >
                Remove logo
              </button>
            ) : null}
          </Section>

          <Section title="Bill to">
            <Field label="Customer billing information">
              <textarea
                className={textareaClass}
                rows={3}
                value={draft.billTo}
                placeholder="Customer name and address"
                onChange={(event) => update("billTo", event.target.value)}
              />
            </Field>
            <Field label="Ship to">
              <textarea
                className={textareaClass}
                rows={2}
                value={draft.shipTo}
                placeholder="Optional"
                onChange={(event) => update("shipTo", event.target.value)}
              />
            </Field>
          </Section>

          <Section title="Invoice details">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Invoice number">
                <input
                  className={inputClass}
                  value={draft.number}
                  onChange={(event) => update("number", event.target.value)}
                />
              </Field>
              <Field label="Date">
                <input
                  className={inputClass}
                  type="date"
                  value={draft.date}
                  onChange={(event) => update("date", event.target.value)}
                />
              </Field>
              <Field label="Payment terms">
                <input
                  className={inputClass}
                  list="payment-terms"
                  value={draft.paymentTerms}
                  onChange={(event) =>
                    update("paymentTerms", event.target.value)
                  }
                />
                <datalist id="payment-terms">
                  {PAYMENT_TERMS.map((term) => (
                    <option key={term} value={term} />
                  ))}
                </datalist>
              </Field>
              <Field label="Due date">
                <input
                  className={inputClass}
                  type="date"
                  value={draft.dueDate}
                  onChange={(event) => update("dueDate", event.target.value)}
                />
              </Field>
              <Field label="PO number">
                <input
                  className={inputClass}
                  value={draft.poNumber}
                  onChange={(event) => update("poNumber", event.target.value)}
                />
              </Field>
              <Field label="Currency">
                <select
                  className={inputClass}
                  value={draft.currency}
                  onChange={(event) => update("currency", event.target.value)}
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Tax, discount, and shipping">
            <AdjustmentField
              label="Tax"
              mode={draft.taxMode}
              value={draft.taxValue}
              modes={["percent", "flat", "off"]}
              onModeChange={(taxMode) => update("taxMode", taxMode)}
              onValueChange={(taxValue) => update("taxValue", taxValue)}
            />
            <AdjustmentField
              label="Discount"
              mode={draft.discountMode}
              value={draft.discountValue}
              modes={["percent", "flat", "off"]}
              onModeChange={(discountMode) =>
                update("discountMode", discountMode)
              }
              onValueChange={(discountValue) =>
                update("discountValue", discountValue)
              }
            />
            <AdjustmentField
              label="Shipping"
              mode={draft.shippingMode}
              value={draft.shippingValue}
              modes={["flat", "off"]}
              onModeChange={(shippingMode) =>
                update(
                  "shippingMode",
                  shippingMode === "percent" ? "flat" : shippingMode,
                )
              }
              onValueChange={(shippingValue) =>
                update("shippingValue", shippingValue)
              }
            />
            <Field label="Amount paid">
              <input
                className={inputClass}
                inputMode="decimal"
                value={draft.amountPaid}
                onChange={(event) => update("amountPaid", event.target.value)}
              />
            </Field>
          </Section>

          <Section title="Line items">
            <div className="space-y-3">
              {draft.items.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className="space-y-2 rounded-md border border-muted p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-xs text-muted-foreground">
                        Item {index + 1}
                      </p>
                      <button
                        type="button"
                        className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                        aria-label={`Remove item ${index + 1}`}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <Field label="Description">
                      <textarea
                        className={textareaClass}
                        rows={2}
                        value={item.description}
                        onChange={(event) =>
                          updateItem(item.id, {
                            description: event.target.value,
                          })
                        }
                      />
                    </Field>
                    <div className="grid grid-cols-3 gap-2">
                      <Field label="Quantity">
                        <input
                          className={inputClass}
                          inputMode="decimal"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(item.id, {
                              quantity: event.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Rate">
                        <input
                          className={inputClass}
                          inputMode="decimal"
                          value={item.rate}
                          onChange={(event) =>
                            updateItem(item.id, { rate: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="Amount">
                        <input
                          className={cn(inputClass, "bg-muted")}
                          readOnly
                          value={formatMoney(
                            lineAmount(item.quantity, item.rate),
                            draft.currency,
                          )}
                        />
                      </Field>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="mr-2 size-4" />
              Add line item
            </Button>
          </Section>

          <Section title="Notes and terms">
            <Field label="Notes">
              <textarea
                className={textareaClass}
                rows={3}
                value={draft.notes}
                onChange={(event) => update("notes", event.target.value)}
              />
            </Field>
            <Field label="Terms">
              <textarea
                className={textareaClass}
                rows={3}
                value={draft.terms}
                placeholder="Optional"
                onChange={(event) => update("terms", event.target.value)}
              />
            </Field>
          </Section>
        </form>

        <div className="invoice-preview-frame lg:sticky lg:top-[4.5rem] lg:max-h-[calc(100vh-5.5rem)] lg:overflow-auto">
          <div className="flex justify-center py-2">
            <InvoiceDocument draft={draft} totals={totals} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-y-3">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function AdjustmentField({
  label,
  mode,
  value,
  modes,
  onModeChange,
  onValueChange,
}: {
  label: string;
  mode: AdjustmentMode | "off" | "flat";
  value: string;
  modes: Array<"percent" | "flat" | "off">;
  onModeChange: (mode: AdjustmentMode) => void;
  onValueChange: (value: string) => void;
}) {
  const modeLabels: Record<"percent" | "flat" | "off", string> = {
    percent: "Percent (%)",
    flat: "Flat amount",
    off: "Off",
  };

  return (
    <div className="space-y-1.5">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-md border border-muted p-0.5">
          {modes.map((option) => (
            <button
              key={option}
              type="button"
              className={cn(
                "rounded px-2 py-1 font-mono text-xs font-semibold",
                mode === option
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => onModeChange(option)}
            >
              {modeLabels[option]}
            </button>
          ))}
        </div>
        {mode !== "off" ? (
          <input
            className={cn(inputClass, "w-28")}
            inputMode="decimal"
            aria-label={`${label} amount`}
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
          />
        ) : null}
      </div>
    </div>
  );
}
