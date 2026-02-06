import mongoose from "mongoose";
const uniqueCustomerDetailSchema = new mongoose.Schema(
  {
    sme_id: {
      type: Number,
      default: null,
    },
    update_date_time: {
      type: String,
      default: null,
    },
    insert_date_time: {
      type: String,
      default: null,
    },
    recent_duration: {
      type: Number,
      default: null,
    },
    recent_via_longcode: {
      type: Number,
      default: null,
    },
    call_type: {
      type: String,
      default: null,
    },
    customer_number: {
      type: String,
      default: null,
    },
    server_ip_address: {
      type: String,
      default: null,
    },
    recent_patched_agent_id: {
      type: Number,
      default: null,
    },
    answer: {
      type: Number,
      default: null,
    },
    address_book_id: {
      type: Number,
      default: null,
    },
    recent_remarks: {
      type: String,
      default: null,
    },
    total_incoming_calls: {
      type: Number,
      default: null,
    },
    total_outgoing_calls: {
      type: Number,
      default: null,
    },
    lead_status: {
      type: Number,
      default: null,
    },
    city_id: {
      type: Number,
      default: null,
    },
    product_id: {
      type: Number,
      default: null,
    },
    product_price: {
      type: Number,
      default: null,
    },
    assigned_agent_id: {
      type: Number,
      default: 0,
    },
    connected_call_duration: {
      type: Number,
      default: null,
    },
    assigned_by: {
      type: String,
      default: null,
    },
    sticky_type: {
      type: Number,
      default: 0,
    },
    session_id: {
      type: String,
      default: null,
    },
    call_flow_id: {
      type: Number,
      default: null,
    },
    call_mode: {
      type: Number,
      default: null,
    },
    campaign_id: {
      type: Number,
      default: null,
    },
    status: {
      type: Number,
      default: null,
    },
    source_id: {
      type: Number,
      default: null,
    },
    customer_followup_id: {
      type: Number,
      default: null,
    },
    assigned_to: {
      type: String,
      default: null,
    },
    is_auto_dialed: {
      type: Number,
      default: null,
    },
    frequency: {
      type: Number,
      default: null,
    },
    uploaded_date_time: {
      type: String,
      default: null,
    },
    other: {
      type: String,
      default: null,
    },
    queue_name: {
      type: String,
      default: null,
    },
    queue_id: {
      type: Number,
      default: null,
    },
    agent_name: {
        type: String,
        default: null,
    },
  },
  {
    collection: "unique_customer_detail",
  }
);

uniqueCustomerDetailSchema.index({ sme_id: 1 });
export const uniqueCustomerDetail = mongoose.model("unique_customer_detail", uniqueCustomerDetailSchema);
