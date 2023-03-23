import { z } from 'zod'
import { LiteralsBoolean } from '../enums/literalsBoolean.enum'
import { UserRole } from '../enums/userRole.enum'

export const UpdateMyUserSchema = z.object({
  body: z.object({
    firstname: z
      .string()
      .trim()
      .regex(/^[a-zA-ZÀ-ÿ0-9]+$/, 'Contains spaces or invalid characters')
      .min(3)
      .max(30)
      .optional(),
    lastname: z
      .string()
      .trim()
      .regex(/^[a-zA-ZÀ-ÿ0-9]+$/, 'Contains spaces or invalid characters')
      .min(3)
      .max(30)
      .optional(),
    oldPassword: z
      .string()
      .min(1, 'It cannot be empty string')
      .optional(),
    newPassword: z
      .string()
      .regex(
        /^([^<>]*)$/,
        'Contains invalid characters'
      )
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
        'Password must contain at least: 1 number, 1 lowercase character, 1 uppercase character'
      )
      .min(6)
      .max(18)
      .optional(),
    active: z.nativeEnum(LiteralsBoolean).optional()
  }).refine(({ oldPassword, newPassword }) => {
    if (newPassword != null && oldPassword == null) return false
    return true
  }, { message: 'oldPassword is required when you send newPassword on request', path: ['oldPassword'] })
})

export const GetMultipleUserSchema = z.object({
  query: z.object({
    active: z
      .nativeEnum(LiteralsBoolean)
      .optional()
  })
})

export const CreateUserSchema = z.object({
  body: z.object({
    firstname: z
      .string()
      .trim()
      .regex(/^[a-zA-ZÀ-ÿ0-9]+$/, 'Contains spaces or invalid characters')
      .min(3)
      .max(30),
    lastname: z
      .string()
      .trim()
      .regex(/^[a-zA-ZÀ-ÿ0-9]+$/, 'Contains spaces or invalid characters')
      .min(3)
      .max(30),
    email: z
      .string()
      .trim()
      .email()
      .max(50)
      .transform(val => val.toLowerCase()),
    password: z
      .string()
      .regex(
        /^([^<>]*)$/,
        'Contains invalid characters'
      )
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
        'Password must contain at least: 1 number, 1 lowercase character, 1 uppercase character'
      )
      .min(6)
      .max(18),
    role: z
      .nativeEnum(UserRole)
  })
})

export const UpdateUserSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24)
      .regex(/^[a-z0-9]+$/i)
  }),
  body: z.object({
    firstname: z
      .string()
      .trim()
      .regex(/^[a-zA-ZÀ-ÿ0-9]+$/, 'Contains spaces or invalid characters')
      .min(3)
      .max(30)
      .optional(),
    lastname: z
      .string()
      .trim()
      .regex(/^[a-zA-ZÀ-ÿ0-9]+$/, 'Contains spaces or invalid characters')
      .min(3)
      .max(30)
      .optional(),
    email: z
      .string()
      .trim()
      .email()
      .max(50)
      .transform(val => val.toLowerCase())
      .optional(),
    password: z
      .string()
      .regex(
        /^([^<>]*)$/,
        'Contains invalid characters'
      )
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
        'Password must contain at least: 1 number, 1 lowercase character, 1 uppercase character'
      )
      .min(6)
      .max(18)
      .optional(),
    role: z
      .nativeEnum(UserRole)
      .optional(),
    active: z
      .nativeEnum(LiteralsBoolean)
      .optional()
  })
})

export const DeleteUserSchema = z.object({
  params: z.object({
    id: z
      .string()
      .min(24)
      .regex(/^[a-z0-9]+$/i, 'Contains spaces or invalid characters')
  })
})

export type UpdateMyBodyUserType = z.infer<typeof UpdateMyUserSchema>['body']
export type GetMultipleQueryUserType = z.infer<typeof GetMultipleUserSchema>['query']
export type CreateBodyUserType = z.infer<typeof CreateUserSchema>['body']
export type UpdateParamsUserType = z.infer<typeof UpdateUserSchema>['params']
export type UpdateBodyUserType = z.infer<typeof UpdateUserSchema>['body']
export type DeleteParamsUserType = z.infer<typeof DeleteUserSchema>['params']
