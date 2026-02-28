import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  student: mongoose.Types.ObjectId;
  professor: mongoose.Types.ObjectId;
  slot: mongoose.Types.ObjectId;
  status: "booked" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    professor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    slot: {
      type: Schema.Types.ObjectId,
      ref: "Availability",
      required: true,
      unique: true // 🔥 prevents double booking
    },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked"
    }
  },
  { timestamps: true }
);

const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema
);

export default Appointment;