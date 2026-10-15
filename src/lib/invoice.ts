export type AdjustmentMode = "off" | "percent" | "flat";

export type LineItem = {
  id: string;
  description: string;
  quantity: string;
  rate: string;
};

export type InvoiceDraft = {
  logo: string | null;
  from: string;
  billTo: string;
  shipTo: string;
  number: string;
  date: string;
  paymentTerms: string;
  dueDate: string;
  poNumber: string;
  currency: string;
  taxMode: AdjustmentMode;
  taxValue: string;
  discountMode: AdjustmentMode;
  discountValue: string;
  shippingMode: "off" | "flat";
  shippingValue: string;
  amountPaid: string;
  notes: string;
  terms: string;
  items: LineItem[];
};

export type InvoiceLine = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

export type InvoiceTotals = {
  lines: InvoiceLine[];
  subtotal: number;
  discount: number;
  discountPercent: number | null;
  tax: number;
  taxPercent: number | null;
  shipping: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  showDiscount: boolean;
  showTax: boolean;
  showShipping: boolean;
  showAmountPaid: boolean;
};

export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "NZD",
  "CHF",
  "JPY",
  "CNY",
  "HKD",
  "SGD",
  "INR",
  "MXN",
  "BRL",
  "ARS",
  "CLP",
  "COP",
  "PEN",
  "SEK",
  "NOK",
  "DKK",
  "PLN",
  "CZK",
  "HUF",
  "RON",
  "TRY",
  "ZAR",
  "AED",
  "SAR",
  "QAR",
  "ILS",
  "KRW",
  "TWD",
  "THB",
  "MYR",
  "IDR",
  "PHP",
  "VND",
  "NGN",
  "KES",
  "EGP",
  "GHS",
] as const;

export const PAYMENT_TERMS = [
  "Due on Receipt",
  "Weekly",
  "Net 7",
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Net 90",
];

export const SAMPLE_INVOICE: InvoiceDraft = {
  logo: null,
  from: "David Ceballos",
  billTo: "Example Client",
  shipTo: "",
  number: "INV-0001",
  date: "2026-01-09",
  paymentTerms: "Weekly",
  dueDate: "",
  poNumber: "",
  currency: "USD",
  taxMode: "percent",
  taxValue: "0",
  discountMode: "off",
  discountValue: "0",
  shippingMode: "off",
  shippingValue: "0",
  amountPaid: "0",
  notes: "Date(s) of Service: 1/03/2026 - 1/09/2026",
  terms: "",
  items: [
    {
      id: "item-1",
      description: "Design Engineering Services (1/03-1/09)",
      quantity: "10",
      rate: "100",
    },
  ],
};

function localToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function blankInvoice(): InvoiceDraft {
  return {
    ...SAMPLE_INVOICE,
    from: "",
    billTo: "",
    shipTo: "",
    number: "",
    date: localToday(),
    paymentTerms: "",
    dueDate: "",
    poNumber: "",
    taxMode: "off",
    taxValue: "0",
    discountMode: "off",
    discountValue: "0",
    shippingMode: "off",
    shippingValue: "0",
    amountPaid: "0",
    notes: "",
    terms: "",
    items: [
      {
        id: "item-1",
        description: "",
        quantity: "",
        rate: "",
      },
    ],
  };
}

export function parseAmount(value: string): number {
  const normalized = value.replace(/,/g, "").trim();
  if (!normalized) return 0;
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function lineAmount(quantity: string, rate: string): number {
  return roundMoney(parseAmount(quantity) * parseAmount(rate));
}

export function calculateInvoice(draft: InvoiceDraft): InvoiceTotals {
  const lines = draft.items
    .map((item) => ({
      id: item.id,
      description: item.description,
      quantity: parseAmount(item.quantity),
      rate: parseAmount(item.rate),
      amount: lineAmount(item.quantity, item.rate),
    }))
    .filter((line) => line.description.trim() !== "" || line.amount !== 0);

  const subtotal = roundMoney(
    lines.reduce((sum, line) => sum + line.amount, 0),
  );

  const showDiscount = draft.discountMode !== "off";
  const discountPercent =
    draft.discountMode === "percent" ? parseAmount(draft.discountValue) : null;
  const discount = showDiscount
    ? roundMoney(
        draft.discountMode === "percent"
          ? subtotal * (parseAmount(draft.discountValue) / 100)
          : parseAmount(draft.discountValue),
      )
    : 0;

  const taxable = roundMoney(subtotal - discount);

  const showTax = draft.taxMode !== "off";
  const taxPercent =
    draft.taxMode === "percent" ? parseAmount(draft.taxValue) : null;
  const tax = showTax
    ? roundMoney(
        draft.taxMode === "percent"
          ? taxable * (parseAmount(draft.taxValue) / 100)
          : parseAmount(draft.taxValue),
      )
    : 0;

  const showShipping = draft.shippingMode !== "off";
  const shipping = showShipping
    ? roundMoney(parseAmount(draft.shippingValue))
    : 0;

  const total = roundMoney(taxable + tax + shipping);
  const amountPaid = roundMoney(Math.max(0, parseAmount(draft.amountPaid)));

  return {
    lines,
    subtotal,
    discount,
    discountPercent,
    tax,
    taxPercent,
    shipping,
    total,
    amountPaid,
    balanceDue: roundMoney(total - amountPaid),
    showDiscount,
    showTax,
    showShipping,
    showAmountPaid: amountPaid > 0,
  };
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatInvoiceDate(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
