import { Router } from "express";
import { authmiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { 
    createAppointment,
    getMyAppointments,
    getProfessorAppointmentsController,
    cancelAppointmentController
 } from "./appointment.controller.js";

const router = Router();

router.post(
  "/:slotId",
  authmiddleware,
  roleMiddleware("student"),
  createAppointment
);

router.get(
  "/me",
  authmiddleware,
  roleMiddleware("student"),
  getMyAppointments
);

router.get(
  "/professor/me",
  authmiddleware,
  roleMiddleware("professor"),
  getProfessorAppointmentsController
);

router.delete(
  "/:appointmentId",
  authmiddleware,
  roleMiddleware("professor"),
  cancelAppointmentController
);



export default router;