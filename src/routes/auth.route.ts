import { NextFunction, Request, Response } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { LoginBodyAuthType, RefreshBodyAuthType, RegisterBodyAuthType } from '../schemas/auth.schema'

const controller: AuthController = new AuthController()

export const fcRegisterUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body = req.body as RegisterBodyAuthType
  try {
    const response = await controller.registerUser(body)
    res.status(201).send(response)
  } catch (err) {
    console.log(`[ODM ERROR]: Register user: ${err}`)
    next(err)
  }
}

export const fcLoginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body = req.body as LoginBodyAuthType
  try {
    const response = await controller.loginUser(body)
    res.status(200).send(response)
  } catch (err) {
    console.log(`[ODM ERROR]: Login user: ${err}`)
    next(err)
  }
}

export const fcRefreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { refreshToken } = req.body as RefreshBodyAuthType
  try {
    const response = await controller.refreshAccessToken(refreshToken)
    res.status(200).send(response)
  } catch (err) {
    console.log(`[ODM ERROR]: Refresh access token: ${err}`)
    next(err)
  }
}
