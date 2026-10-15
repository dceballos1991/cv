---
name: generate-invoice
description: >-
  Generate a local invoice PDF from a JSON file with the project invoice
  command. Use when creating, generating, or writing an invoice, billing a
  client, or producing an invoice PDF in this repository. Do not open the
  /invoice page.
---

# Generate an invoice

Invoices hold client and rate details, so they live in `private/invoices/`, which git ignores. Never write an invoice JSON or PDF anywhere else in the repo.

Do not open `/invoice`. Do not compute totals. Write a JSON file and run the command.

From the project root:

```bash
npm run invoice -- private/invoices/INVOICE-NUMBER.json
```

The command writes `private/invoices/INVOICE-NUMBER.pdf` when the JSON lives in `private/invoices/`, then prints the PDF path and the balance due. Exit code 1 names the invalid field. Fix that field and run the command again.

## File

Sender, currency, and tax come from `private/invoices/defaults.json`. Put only what changes in the invoice file. `quantity` and `rate` are numbers.

```json
{
  "number": "INV-0001",
  "date": "2026-01-09",
  "billTo": "Example Client",
  "paymentTerms": "Weekly",
  "notes": "Date(s) of Service: 1/03/2026 - 1/09/2026",
  "items": [
    {
      "description": "Design Engineering Services (1/03-1/09)",
      "quantity": 10,
      "rate": 100
    }
  ]
}
```

Required: `billTo`, `number`, `date` (`YYYY-MM-DD`), and at least one item with `description`, `quantity`, and `rate`.

Optional: `from`, `shipTo`, `paymentTerms`, `dueDate`, `poNumber`, `notes`, `terms`, `logo` (image path), `currency`, `taxMode` (`off`, `percent`, `flat`), `taxValue`, `discountMode`, `discountValue`, `shippingMode` (`off`, `flat`), `shippingValue`, `amountPaid`.

`subtotal`, `total`, `balanceDue`, and each item's `amount` are ignored.

## Other calls

```bash
npm run invoice -- private/invoices/INVOICE-NUMBER.json --out /tmp/invoice.pdf
npm run invoice -- --out private/invoices/INVOICE-NUMBER.pdf -
```

The second form reads the JSON from stdin. Without `--out`, stdin writes `private/invoices/<number>.pdf`.
