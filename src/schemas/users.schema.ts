import { z } from "zod";
import { LiteralsBoolean } from "../enums/literalsBoolean.enum";

export const GetUsersSchema = z.object({
  query: z.object({
    active: z.nativeEnum(LiteralsBoolean).optional(),
  }),
});

export type GetBodyUsersType = z.infer<typeof GetUsersSchema>["query"];
