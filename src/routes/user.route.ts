import { NextFunction, Request, Response } from 'express'
import { UserController } from '../controllers/user.controller'
import { DeleteParamsUserType, CreateBodyUserType, GetBodyUserType, UpdateBodyUserType, UpdateParamsUserType } from '../schemas/user.schema'
import { literalToBoolean } from '../enums/literalsBoolean.enum'

const controller: UserController = new UserController()

export const fcGetMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user
  if (userId == null) {
    res.status(400).send({ msg: 'ERROR: Invalid Access Token' })
    return
  }
  try {
    const response = await controller.getMe(userId)
    res.status(200).send(response)
  } catch (err) {
    console.log(`[ODM ERROR]: Get me: ${err}`)
    next(err)
  }
}

export const fcGetUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { active } = req.query as GetBodyUserType
  const activeBool = literalToBoolean(active)
  try {
    const response = await controller.getUsers(activeBool)
    res.status(200).send(response)
  } catch (err) {
    console.log(`[ODM ERROR]: Get all users: ${err}`)
    next(err)
  }
}

export const fcCreateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body = req.body as CreateBodyUserType
  const avatar = req.file?.path
  try {
    const response = await controller.createUser(body, avatar)
    res.status(201).send(response)
  } catch (err) {
    console.log(`[ODM ERROR]: Create user: ${err}`)
    next(err)
  }
}

export const fcUpdateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params as UpdateParamsUserType
  const body = req.body as UpdateBodyUserType
  const avatar = req.file?.path
  try {
    const response = await controller.updateUser(id, body, avatar)
    res.status(201).send(response)
  } catch (err) {
    console.log(`[ODM ERROR]: Partial update user: ${err}`)
    next(err)
  }
}

export const fcDeleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params as DeleteParamsUserType
  try {
    const response = await controller.deleteUser(id)
    res.status(200).send(response)
  } catch (err) {
    console.log(`[ODM ERROR]: Partial update user: ${err}`)
    next(err)
  }
}
