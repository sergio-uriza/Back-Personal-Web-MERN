import { z } from 'zod'
import { LiteralsBoolean } from '../enums/literalsBoolean.enum'
import { UserRole } from '../enums/userRole.enum'

export const GetUsersSchema = z.object({
  query: z.object({
    active: z.nativeEnum(LiteralsBoolean).optional()
  })
})

export const CreateUsersSchema = z.object({
  body: z.object({
    firstname: z.string().trim().min(3).regex(/^[a-z0-9]+$/i, 'Contains spaces or invalid characters'),
    lastname: z.string().trim().min(3).regex(/^[a-z0-9]+$/i, 'Contains spaces or invalid characters'),
    email: z.string().trim().min(1, 'Must have content').email().transform(val => val.toLowerCase()),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/, 'Password must be 6 characters or longer and must contain at least: 1 number, 1 lowercase character, 1 uppercase character'),
    role: z.nativeEnum(UserRole)
  })
})

export const UpdateUsersSchema = z.object({
  params: z.object({
    id: z.string().length(24).regex(/^[a-z0-9]+$/i)
  }),
  body: z.object({
    firstname: z.string().trim().min(3).regex(/^[a-z0-9]+$/i, 'Contains spaces or invalid characters').optional(),
    lastname: z.string().trim().min(3).regex(/^[a-z0-9]+$/i, 'Contains spaces or invalid characters').optional(),
    email: z.string().trim().min(1, 'Must have content').email().transform(val => val.toLowerCase()).optional(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/, 'Password must be 6 characters or longer and must contain at least: 1 number, 1 lowercase character, 1 uppercase character').optional(),
    role: z.nativeEnum(UserRole).optional(),
    active: z.nativeEnum(LiteralsBoolean).optional()
  })
})

export const DeleteUsersSchema = z.object({
  params: z.object({
    id: z.string().min(24).regex(/^[a-z0-9]+$/i, 'Contains spaces or invalid characters')
  })
})

export type GetBodyUsersType = z.infer<typeof GetUsersSchema>['query']
export type CreateBodyUsersType = z.infer<typeof CreateUsersSchema>['body']
export type UpdateParamsUsersType = z.infer<typeof UpdateUsersSchema>['params']
export type UpdateBodyUsersType = z.infer<typeof UpdateUsersSchema>['body']
export type DeleteParamsUsersType = z.infer<typeof DeleteUsersSchema>['params']
