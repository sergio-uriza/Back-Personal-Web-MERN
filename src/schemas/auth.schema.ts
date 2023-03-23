import { z } from 'zod'

export const RegisterAuthSchema = z.object({
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
      .max(18)
  })
})

export const LoginAuthSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email()
      .max(50)
      .transform(val => val.toLowerCase()),
    password: z
      .string()
      .min(1)
      .max(25)
  })
})

export const RefreshAuthSchema = z.object({
  body: z.object({
    refreshToken: z
      .string()
      .min(1, 'It cannot be empty string')
      .max(250)
  })
})

export type RegisterBodyAuthType = z.infer<typeof RegisterAuthSchema>['body']
export type LoginBodyAuthType = z.infer<typeof LoginAuthSchema>['body']
export type RefreshBodyAuthType = z.infer<typeof RefreshAuthSchema>['body']
