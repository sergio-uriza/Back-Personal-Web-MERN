import { NextFunction, Request, Response } from 'express'
import { UserController } from '../controllers/users.controller'
import { DeleteParamsUsersType, CreateBodyUsersType, GetBodyUsersType, UpdateBodyUsersType, UpdateParamsUsersType } from '../schemas/users.schema'
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
  const { active } = req.query as GetBodyUsersType
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
  const body = req.body as CreateBodyUsersType
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
  const { id } = req.params as UpdateParamsUsersType
  const body = req.body as UpdateBodyUsersType
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
  const { id } = req.params as DeleteParamsUsersType
  try {
    const response = await controller.deleteUser(id)
    res.status(200).send(response)
  } catch (err) {
    console.log(`[ODM ERROR]: Partial update user: ${err}`)
    next(err)
  }
}
