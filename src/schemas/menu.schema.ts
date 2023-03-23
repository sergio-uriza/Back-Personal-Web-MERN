import { z } from 'zod'
import { LiteralsBoolean } from '../enums/literalsBoolean.enum'

export const GetMultipleMenuSchema = z.object({
  query: z.object({
    active: z
      .nativeEnum(LiteralsBoolean)
      .optional()
  })
})

export const CreateMenuSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9À-ÿ?¿!¡_\s]+$/, 'Contains invalid characters')
      .min(3)
      .max(18),
    path: z
      .string()
      .trim()
      .regex(
        /^((https?:\/\/)|\/)[\w-@:;)(+.?&/=$!*']+$/,
        'Path must not contain spaces or invalid characters'
      )
      .min(3)
      .max(180),
    order: z
      .number()
      .int()
      .gte(-100)
      .lte(100),
    active: z
      .boolean()
  })
})

export const UpdateMenuSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24)
      .regex(/^[a-z0-9]+$/i)
  }),
  body: z.object({
    title: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9À-ÿ?¿!¡_\s]+$/, 'Contains invalid characters')
      .min(3)
      .max(18)
      .optional(),
    path: z
      .string()
      .trim()
      .regex(
        /^((https?:\/\/)|\/)[\w-@:;)(+.?&/=$!*']+$/,
        'Path must not contain spaces or invalid characters'
      )
      .min(3)
      .max(180)
      .optional(),
    order: z
      .number()
      .int()
      .gte(-100)
      .lte(100)
      .optional(),
    active: z
      .boolean()
      .optional()
  })
})

export const DeleteMenuSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24)
      .regex(/^[a-z0-9]+$/i)
  })
})

export type GetMultipleQueryMenuType = z.infer<typeof GetMultipleMenuSchema>['query']
export type CreateBodyMenuType = z.infer<typeof CreateMenuSchema>['body']
export type UpdateParamsMenuType = z.infer<typeof UpdateMenuSchema>['params']
export type UpdateBodyMenuType = z.infer<typeof UpdateMenuSchema>['body']
export type DeleteParamsMenuType = z.infer<typeof DeleteMenuSchema>['params']
