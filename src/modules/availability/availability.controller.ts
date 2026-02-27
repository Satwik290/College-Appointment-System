import { Request, Response } from 'express';
import { createAvailabilitySchema } from './availability.validation.js';
import { createAvailabilitySlot, getAvailableSlots, getProfessorSlots, updateAvailabilitySlot, deleteAvailabilitySlot } from './availability.service.js';

export const createAvailability = async (req: Request,res: Response) => {
  try {
    const validatedData = createAvailabilitySchema.parse(req.body);
    const slot = await createAvailabilitySlot(req.user!.id, validatedData);
     return res.status(201).json({
      success: true,
      data: slot,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Invalid input',
    });
  }
};

export const viewAvailability = async (req: Request<{ professorId: string }>,res: Response,) => {
  try {
    const { professorId } = req.params;
    const slots = await getAvailableSlots(professorId);
    return res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getMyAvailability = async (req: Request,res: Response) => {
  try {
    const slots = await getProfessorSlots(req.user!.id);
    return res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error ',
    });
  }
};

export const updateAvailability = async (  req: Request<{ slotId: string }>,res: Response) => {
  try {
    const { slotId } = req.params;
    const { startTime, endTime } = req.body;
    const updated = await updateAvailabilitySlot(
      req.user!.id,
      slotId,
      startTime,
      endTime
    );
    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Invalid input',
    });
  }
};

export const deleteAvailability = async ( req: Request<{ slotId: string }>,  res: Response) => {
  try {
    const { slotId } = req.params;
    await deleteAvailabilitySlot(req.user!.id, slotId);
    return res.status(200).json({
      success: true,
      message: "Slot deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Invalid input',
    });
  }
};
