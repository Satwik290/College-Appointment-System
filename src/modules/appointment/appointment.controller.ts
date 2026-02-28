import { Request, Response } from "express";
import { bookAppointment, getStudentAppointments,getProfessorAppointments , cancelAppointment } from "./appointment.service.js";

export const createAppointment = async (
  req: Request<{ slotId: string }>,
  res: Response,
 ) => {
  try {
    const { slotId } = req.params;
    const appointment = await bookAppointment(
      req.user!.id,
      slotId
    );
    return res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to book appointment"
    });
  }
};

export const getMyAppointments = async (
  req: Request,
  res: Response,
 ) => {
  try {
    const appointments = await getStudentAppointments(req.user!.id);

    return res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch appointments"
    });
  }
};

export const getProfessorAppointmentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const appointments = await getProfessorAppointments(
      req.user!.id
    );
    return res.status(200).json({
      success: true,
      data: appointments
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch appointments"
    });
  }
};

export const cancelAppointmentController = async (
  req: Request<{ appointmentId: string }>,
  res: Response,
 ) => {
  try {
    const { appointmentId } = req.params;
    const result = await cancelAppointment(
      req.user!.id,
      appointmentId
    );
    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to cancel appointment"
    });
  }
};