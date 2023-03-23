import { z } from 'zod'

export const GetEmailsNewsletterSchema = z.object({
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
      .optional(),
    order: z.coerce
      .number()
      .refine(val => val === 1 || val === -1, 'Only 1 or -1 is allowed')
      .optional()
  })
})

export const SuscribeEmailNewsletterSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email()
      .max(50)
      .transform(val => val.toLowerCase())
  })
})

export const DeleteEmailNewsletterSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24)
      .regex(/^[a-z0-9]+$/i)
  })
})

export type GetEmailsQueryNewsletterType = z.infer<typeof GetEmailsNewsletterSchema>['query']
export type SuscribeEmailBodyNewsletterType = z.infer<typeof SuscribeEmailNewsletterSchema>['body']
export type DeleteEmailParamsNewsletterType = z.infer<typeof DeleteEmailNewsletterSchema>['params']
