export interface RawInvoicesInterface {
    INVOICE_ID: string,
    VENDOR_ID: string,
    INVOICE_NUMBER: string,
    INVOICE_DATE: string,
    INVOICE_TOTAL: string,
    PAYMENT_TOTAL: string,
    CREDIT_TOTAL: string,
    BANK_ID: string,
    INVOICE_DUE_DATE: string,
    PAYMENT_DATE?: string,
    CURRENCY: string
}