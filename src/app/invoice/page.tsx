import type { Metadata } from "next";

import { InvoiceGenerator } from "@/components/invoice/invoice-generator";

export const metadata: Metadata = {
  title: "Invoice Generator",
  description:
    "Create an invoice with line items, tax, and discounts, then download it as a PDF.",
};

export default function InvoicePage() {
  return <InvoiceGenerator />;
}
