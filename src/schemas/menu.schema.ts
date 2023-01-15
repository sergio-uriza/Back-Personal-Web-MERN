import { z } from 'zod'
import { LiteralsBoolean } from '../enums/literalsBoolean.enum'

export const GetMenuSchema = z.object({
  query: z.object({
    active: z.nativeEnum(LiteralsBoolean).optional()
  })
})

export const CreateMenuSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Must have content').regex(/^[a-z0-9\-_\s]+$/i, 'Contains invalid characters'),
    path: z.string().trim().min(1, 'Must have content').startsWith('/', 'Must start with: /').regex(/^\S+$/, 'Contains spaces').transform(val => val.toLowerCase()),
    order: z.number().int(),
    active: z.boolean()
  })
})

export const UpdateMenuSchema = z.object({
  params: z.object({
    id: z.string().length(24).regex(/^[a-z0-9]+$/i)
  }),
  body: z.object({
    title: z.string().trim().min(1, 'Must have content').regex(/^[a-z0-9\-_\s]+$/i, 'Contains invalid characters').optional(),
    path: z.string().trim().min(1, 'Must have content').startsWith('/', 'Must start with: /').regex(/^\S+$/, 'Contains spaces').transform(val => val.toLowerCase()).optional(),
    order: z.number().int().optional(),
    active: z.boolean().optional()
  })
})

export const DeleteMenuSchema = z.object({
  params: z.object({
    id: z.string().length(24).regex(/^[a-z0-9]+$/i)
  })
})

export type GetQueryMenuType = z.infer<typeof GetMenuSchema>['query']
export type CreateBodyMenuType = z.infer<typeof CreateMenuSchema>['body']
export type UpdateParamsMenuType = z.infer<typeof UpdateMenuSchema>['params']
export type UpdateBodyMenuType = z.infer<typeof UpdateMenuSchema>['body']
export type DeleteParamsMenuType = z.infer<typeof DeleteMenuSchema>['params']
