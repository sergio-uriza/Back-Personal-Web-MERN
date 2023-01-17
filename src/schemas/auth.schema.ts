import { z } from 'zod'

export const RegisterAuthSchema = z.object({
  body: z.object({
    firstname: z.string().trim().min(3).regex(/^[a-z0-9]+$/i, 'Contains spaces or invalid characters'),
    lastname: z.string().trim().min(3).regex(/^[a-z0-9]+$/i, 'Contains spaces or invalid characters'),
    email: z.string().min(1, 'must have content').trim().email().transform(val => val.toLowerCase()),
    password: z.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/, 'Password must be 6 characters or longer and must contain at least: 1 number, 1 lowercase character, 1 uppercase character')
  })
})

export const LoginAuthSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'must have content').trim().email().transform(val => val.toLowerCase()),
    password: z.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/, 'Password must be 6 characters or longer and must contain at least: 1 number, 1 lowercase character, 1 uppercase character')
  })
})

export const RefreshAuthSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Must have content')
  })
})

export type RegisterBodyAuthType = z.infer<typeof RegisterAuthSchema>['body']
export type LoginBodyAuthType = z.infer<typeof LoginAuthSchema>['body']
export type RefreshBodyAuthType = z.infer<typeof RefreshAuthSchema>['body']
