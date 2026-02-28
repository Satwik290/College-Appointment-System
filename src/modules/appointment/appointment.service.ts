import Availability from "../availability/availability.model.js";
import Appointment from "./appointment.model.js";

export const bookAppointment = async (
  studentId: string,
  slotId: string
) => {
  const slot = await Availability.findOneAndUpdate(
    { _id: slotId, isBooked: false },
    { isBooked: true },
    { new: true }
  );
  if (!slot) {
    throw new Error("Slot already booked or not found");
  }

  const appointment = await Appointment.create({
    student: studentId,
    professor: slot.professor,
    slot: slot._id
  });
  return appointment;
};

export const getStudentAppointments = async (studentId: string) => {
  return Appointment.find({
    student: studentId,
    status: "booked"
  })
    .populate("professor", "name email")
    .populate("slot")
    .sort({ createdAt: -1 });
};

export const getProfessorAppointments = async (
  professorId: string
) => {
  return Appointment.find({
    professor: professorId,
    status: "booked"
  })
    .populate("student", "name email")
    .populate("slot")
    .sort({ createdAt: -1 });
};

export const cancelAppointment = async ( professorId: string,appointmentId: string) => {
  const appointment = await Appointment.findOne({
    _id: appointmentId,
    professor: professorId,
    status: "booked"
  });
  if (!appointment) {
    throw new Error("Appointment not found");
  }

  appointment.status = "cancelled";
  await appointment.save();

  await Availability.findByIdAndUpdate(
    appointment.slot,
    { isBooked: false }
  );
  return appointment;
};