import { Router } from 'express';
import { 
createAvailability, 
viewAvailability,
getMyAvailability,
updateAvailability,
deleteAvailability } from './availability.controller.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { authmiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post(
  "/",
  authmiddleware,
  roleMiddleware("professor"),
  createAvailability
);

router.get(
  "/me",
  authmiddleware,
  roleMiddleware("professor"),
  getMyAvailability
);

router.get(
  "/:professorId",
  authmiddleware,
  roleMiddleware("student"),
  viewAvailability
);

router.put(
  "/:slotId",
  authmiddleware,
  roleMiddleware("professor"),
  updateAvailability
);

router.delete(
  "/:slotId",
  authmiddleware,
  roleMiddleware("professor"),
  deleteAvailability
);

export default router;
