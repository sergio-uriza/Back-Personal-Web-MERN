import { z } from "zod";
import { LiteralsBoolean } from "../enums/literalsBoolean.enum";
import { UserRole } from "../enums/userRole.enum";

export const GetUsersSchema = z.object({
  query: z.object({
    active: z.nativeEnum(LiteralsBoolean).optional(),
  }),
});

export const CreateUsersSchema = z.object({
  body: z.object({
    firstname: z.string().trim().min(3),
    lastname: z.string().trim().min(3),
    email: z.string().min(1, "must have content").trim().email(),
    password: z.string().min(6),
    role: z.nativeEnum(UserRole),
  }),
});

export const UpdateUsersSchema = z.object({
  params: z.object({
    id: z.string().min(24).regex(/^[a-z0-9]+$/i)
  }),
  body: z.object({
    firstname: z.string().trim().min(3).optional(),
    lastname: z.string().trim().min(3).optional(),
    email: z.string().min(1, "must have content").trim().email().optional(),
    password: z.string().min(6).optional(),
    role: z.nativeEnum(UserRole).optional(),
    active: z.nativeEnum(LiteralsBoolean).optional(),
  }),
});

export const DeleteUsersSchema = z.object({
  params: z.object({
    id: z.string().min(24).regex(/^[a-z0-9]+$/i)
  }),
});

export type GetBodyUsersType = z.infer<typeof GetUsersSchema>["query"];
export type CreateBodyUsersType = z.infer<typeof CreateUsersSchema>["body"];
export type UpdateParamsUsersType = z.infer<typeof UpdateUsersSchema>["params"];
export type UpdateBodyUsersType = z.infer<typeof UpdateUsersSchema>["body"];
export type DeleteParamsUsersType = z.infer<typeof DeleteUsersSchema>["params"];
