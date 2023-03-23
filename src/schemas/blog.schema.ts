import { z } from 'zod'

export const GetByPathBlogSchema = z.object({
  params: z.object({
    path: z
      .string()
      .regex(
        /^[\w-@:+.=]+$/,
        'Path must not contain spaces or invalid characters'
      )
      .min(5)
      .max(400)
      .transform(val => `/${val}`)
  })
})

export const GetMultipleBlogSchema = z.object({
  query: z.object({
    limit: z
      .coerce.number()
      .nonnegative()
      .int()
      .optional(),
    page: z
      .coerce.number()
      .positive()
      .int()
      .optional()
  })
})

export const CreateBlogSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9À-ÿ?¿!¡:;)(+*.,$'"\-\s]+$/,
        'Contains invalid characters'
      )
      .min(8)
      .max(90),
    content: z
      .string()
      .trim()
      .min(20)
      .max(35000),
    path: z
      .string()
      .trim()
      .regex(
        /^\/[\w-@:+.=]+$/,
        'Path must not contain spaces or invalid characters'
      )
      .min(5)
      .max(400)
  })
})

export const UpdateBlogSchema = z.object({
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
      .regex(
        /^[a-zA-Z0-9À-ÿ?¿!¡:;)(+*.,$'"\-\s]+$/,
        'Contains invalid characters'
      )
      .min(8)
      .max(90)
      .optional(),
    content: z
      .string()
      .trim()
      .min(20)
      .max(35000)
      .optional(),
    path: z
      .string()
      .trim()
      .regex(
        /^\/[\w-@:+.=]+$/,
        'Path must not contain spaces or invalid characters'
      )
      .min(5)
      .max(400)
      .optional()
  })
})

export const DeleteBlogSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24)
      .regex(/^[a-z0-9]+$/i)
  })
})

export type GetByPathParamsBlogType = z.infer<typeof GetByPathBlogSchema>['params']
export type GetMultipleQueryBlogType = z.infer<typeof GetMultipleBlogSchema>['query']
export type CreateBodyBlogType = z.infer<typeof CreateBlogSchema>['body']
export type UpdateParamsBlogType = z.infer<typeof UpdateBlogSchema>['params']
export type UpdateBodyBlogType = z.infer<typeof UpdateBlogSchema>['body']
export type DeleteParamsBlogType = z.infer<typeof DeleteBlogSchema>['params']
