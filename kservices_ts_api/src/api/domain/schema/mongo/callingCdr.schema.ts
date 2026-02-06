import mongoose, { Schema } from "mongoose";
import { addressBook } from "../../../../api/domain/schema/mongo/addressBook.schema";
const callingCdrSchema = new mongoose.Schema(
  {
    sme_id: { type: Number, default: null },
    call_direction: { type: String, default: null },
    connected_duration: { type: Number, default: null },
    ringing_duration: { type: Number, default: null },
    customer_number: { type: String, default: null },
    agent_number: { type: String, default: null },
    agent_name: { type: String, default: null },
    longcode: { type: Number, default: null },
    session_id: { type: String, default: null },
    answer: { type: Number, default: null },
    call_direction_status: { type: Number, default: null },
    call_recorded_file: { type: String, default: null },
    call_recording_status: { type: Number, default: null },
    call_status: { type: Number, default: null },
    cdr_mode: { type: Number, default: null },
    call_mode: { type: Number, default: null },
    channel_no: { type: Number, default: null },
    disconnected_by: { type: String, default: null },
    remarks: { type: String, default: null },
    duration: { type: Number, default: null },
    end_date_time: { type: String, default: null },
    merge_status: { type: Number, default: null },
    insert_date_time: { type: String, default: null },
    master_shortcode: { type: String, default: null },
    patched_agent_id: { type: Number, default: null },
    server_ip_address: { type: String, default: null },
    shortcode_mapping: { type: String, default: null },
    sme_identifier: { type: String, default: null },
    start_date_time: { type: String, default: null },
    voicemail_recording_file: { type: String, default: 0 },
    voicemail_recording_status: { type: Number, default: 0 },
    call_type: { type: String, default: null },
    hlr: { type: String, default: null },
    call_description: { type: String, default: 0 },
    ivr_duration: { type: Number, default: 0 },
    customer_status: { type: Number, default: null },
    final_status: { type: String, default: null },
    call_flow_id: { type: Number, default: null },
    call_flow_name: { type: String, default: null },
    provisional_flag: { type: Number, default: null },
    final_dtmf: { type: String, default: null },
    queue_id: { type: Number, default: 0 },
    queue_name: { type: String, default: null },
    recording_path: { type: String, default: null },
    blacklist: { type: Number, default: 0 },
    did: { type: String, default: null },
    address_book: [{ type: Schema.Types.ObjectId, ref: 'address_book' }]
  },
  {
    collection: "calling_cdr",
  }
);

callingCdrSchema.index({ sme_id: 1 });
callingCdrSchema.index({ call_recorded_file: 1 });
callingCdrSchema.index({ session_id: 1 });
callingCdrSchema.index({ customer_number: 1 });
callingCdrSchema.index({ sme_id: 1, call_recorded_file: 1, session_id: 1, customer_number: 1 });

export const callingCdr = mongoose.model("calling_cdr", callingCdrSchema);
