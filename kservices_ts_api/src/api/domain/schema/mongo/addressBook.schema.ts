import mongoose, { Schema } from "mongoose";

const addressBookSchema = new mongoose.Schema(
  {
    sme_id: { type: Number, default: null },
    customer_name: { type: String, default: null },
    customer_number_primary: { type: String, default: null },
    status: { type: Number, default: null },
    mode: { type: Number, default: 0 },
    customer_number_secondary: { type: String, default: null },
    company_name: { type: String, default: null },
    email_id: { type: String, default: null },
    created_by: { type: Number, default: null },
    visibility_flag: { type: Number, default: null },
    is_updated: { type: Number, default: 1 },
    address: { type: String, default: null },
    insert_date_time: { type: String, default: null },
    updated_date_time: { type: String, default: null },
    calling_cdr: { type: mongoose.Schema.Types.ObjectId, ref: 'calling_cdr' }
  },
  {
    collection: "address_book",
  }
);

addressBookSchema.index({ sme_id: 1 });
addressBookSchema.index({ customer_number_primary: 1 });
addressBookSchema.index({ sme_id: 1, customer_number_primary: 1 });

export const addressBook = mongoose.model("address_book", addressBookSchema);
