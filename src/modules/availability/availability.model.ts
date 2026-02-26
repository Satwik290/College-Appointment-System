import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailability extends Document {
  professor: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const availabilitySchema = new Schema<IAvailability>({
       professor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    startTime: {
      type: Date,
      required: true,
      index: true
    },
    endTime: {
      type: Date,
      required: true
    },
    isBooked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

availabilitySchema.index(
  { professor: 1, startTime: 1 },
  { unique: true }
);

const Availability = mongoose.model<IAvailability>(
  "Availability",
  availabilitySchema
);

export default Availability;