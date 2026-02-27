import Availability from "./availability.model.js";
import { CreateAvailabilityInput } from "./availability.validation.js";

export const createAvailabilitySlot = async ( professorId: string, data: CreateAvailabilityInput) => {
  const { startTime, endTime } = data;
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    throw new Error("Start time must be before end time");
  }
  const slot = await Availability.create({
    professor: professorId,
    startTime: start,
    endTime: end
  });

  return slot;
};

export const getAvailableSlots = async (professorId: string) => {
  return Availability.find({
    professor: professorId,
    isBooked: false
  }).sort({ startTime: 1 });
};

export const getProfessorSlots = async (professorId: string) => {
  return Availability.find({ professor: professorId })
    .sort({ startTime: 1 });
};

export const updateAvailabilitySlot = async (
  professorId: string,
  slotId: string,
  startTime: string,
  endTime: string
) => {
  const slot = await Availability.findOne({
    _id: slotId,
    professor: professorId,
  });

  if (!slot) {
    throw new Error("Slot not found");
  }

  if (slot.isBooked) {
    throw new Error("Cannot update a booked slot");
  }
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (start >= end) {
    throw new Error("Start time must be before end time");
  }
  slot.startTime = start;
  slot.endTime = end;
  await slot.save();
  return slot;
};

export const deleteAvailabilitySlot = async (
  professorId: string,
  slotId: string
) => {
  const slot = await Availability.findOne({
    _id: slotId,
    professor: professorId,
  });

  if (!slot) {
    throw new Error("Slot not found");
  }

  if (slot.isBooked) {
    throw new Error("Cannot delete a booked slot");
  }

  await slot.deleteOne();
  return true;
};