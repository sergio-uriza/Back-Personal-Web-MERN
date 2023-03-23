import { z } from 'zod'

export const GetMultipleCourseSchema = z.object({
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

export const CreateCourseSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9À-ÿ?¿!¡:;)(+.,$'"\-\s]+$/,
        'Contains invalid characters'
      )
      .min(8)
      .max(60),
    description: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9À-ÿ?¿!¡:;)(+.,$'"\-\s]+$/,
        'Contains invalid characters'
      )
      .min(5)
      .max(180),
    url: z
      .string()
      .trim()
      .regex(
        /^(ftp|http|https):\/\/[\w-@:;)(+.?&/=$!*']+$/,
        'Must be a valid URL'
      )
      .min(10)
      .max(600),
    price: z
      .coerce.number()
      .nonnegative()
      .int()
      .max(6000000),
    score: z
      .coerce.number()
      .positive()
      .lte(5)
      .multipleOf(0.1)
  })
})

export const UpdateCourseSchema = z.object({
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
        /^[a-zA-Z0-9À-ÿ?¿!¡:;)(+.,$'"\-\s]+$/,
        'Contains invalid characters'
      )
      .min(8)
      .max(60)
      .optional(),
    description: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9À-ÿ?¿!¡:;)(+.,$'"\-\s]+$/,
        'Contains invalid characters'
      )
      .min(5)
      .max(180)
      .optional(),
    url: z
      .string()
      .trim()
      .regex(
        /^(ftp|http|https):\/\/[\w-@:;)(+.?&/=$!*']+$/,
        'Must be a valid URL'
      )
      .min(10)
      .max(600)
      .optional(),
    price: z
      .coerce.number()
      .nonnegative()
      .int()
      .max(6000000)
      .optional(),
    score: z
      .coerce.number()
      .positive()
      .lte(5)
      .multipleOf(0.1)
      .optional()
  })
})

export const DeleteCourseSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24)
      .regex(/^[a-z0-9]+$/i)
  })
})

export type GetMultipleQueryCourseType = z.infer<typeof GetMultipleCourseSchema>['query']
export type CreateBodyCourseType = z.infer<typeof CreateCourseSchema>['body']
export type UpdateParamsCourseType = z.infer<typeof UpdateCourseSchema>['params']
export type UpdateBodyCourseType = z.infer<typeof UpdateCourseSchema>['body']
export type DeleteParamsCourseType = z.infer<typeof DeleteCourseSchema>['params']
