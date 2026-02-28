import { z } from "zod";

export const createAvailabilitySchema = z.object({
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime()
});

export type CreateAvailabilityInput =
  z.infer<typeof createAvailabilitySchema> ;