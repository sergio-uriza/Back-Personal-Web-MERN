import { z } from 'zod'

export const GetCourseSchema = z.object({
  query: z.object({
    limit: z.coerce.number().nonnegative().int().optional(),
    page: z.coerce.number().positive().int().optional()
  })
})

export const CreateCourseSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Must have content').regex(/^[a-z0-9\u00C0-\u017F\-_)(.,:;\s]+$/i, 'Contains invalid characters'),
    description: z.string().trim().min(1, 'Must have content').regex(/^[a-z0-9\u00C0-\u017F\-_)(.,:;\s]+$/i, 'Contains invalid characters'),
    url: z.string().trim().min(1, 'Must have content').regex(/^(ftp|http|https):\/\/[^ "]+$/, 'Must be a valid URL').transform(val => val.toLowerCase()),
    price: z.coerce.number().nonnegative().int(),
    score: z.coerce.number().positive().lte(5).multipleOf(0.1)
  })
})

export const UpdateCourseSchema = z.object({
  params: z.object({
    id: z.string().length(24).regex(/^[a-z0-9]+$/i)
  }),
  body: z.object({
    title: z.string().trim().min(1, 'Must have content').regex(/^[a-z0-9\u00C0-\u017F\-_)(.,:;\s]+$/i, 'Contains invalid characters').optional(),
    description: z.string().trim().min(1, 'Must have content').regex(/^[a-z0-9\u00C0-\u017F\-_)(.,:;\s]+$/i, 'Contains invalid characters').optional(),
    url: z.string().trim().min(1, 'Must have content').regex(/^(ftp|http|https):\/\/[^ "]+$/, 'Must be a valid URL').transform(val => val.toLowerCase()).optional(),
    price: z.coerce.number().nonnegative().int().optional(),
    score: z.coerce.number().positive().lte(5).multipleOf(0.1).optional()
  })
})

export const DeleteCourseSchema = z.object({
  params: z.object({
    id: z.string().length(24).regex(/^[a-z0-9]+$/i)
  })
})

export type GetQueryCourseType = z.infer<typeof GetCourseSchema>['query']
export type CreateBodyCourseType = z.infer<typeof CreateCourseSchema>['body']
export type UpdateParamsCourseType = z.infer<typeof UpdateCourseSchema>['params']
export type UpdateBodyCourseType = z.infer<typeof UpdateCourseSchema>['body']
export type DeleteParamsCourseType = z.infer<typeof DeleteCourseSchema>['params']
