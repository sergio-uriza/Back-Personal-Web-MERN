import { z } from "zod";

export const RegisterAuthSchema = z.object({
  body: z.object({
    firstname: z.string().trim().min(3),
    lastname: z.string().trim().min(3),
    email: z.string().min(1, 'must have content').trim().email(),
    password: z.string().min(6),
  }),
});

export const LoginAuthSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'must have content').trim().email(),
    password: z.string().min(6),
  }),
})

export const RefreshAuthSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'must have content')
  }),
})

export type RegisterBodyAuthType = z.infer<typeof RegisterAuthSchema>['body']
export type LoginBodyAuthType = z.infer<typeof LoginAuthSchema>['body']
export type RefreshBodyAuthType = z.infer<typeof RefreshAuthSchema>['body']
