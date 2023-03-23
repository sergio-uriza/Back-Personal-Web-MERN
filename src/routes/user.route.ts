import { NextFunction, Request, Response } from 'express'
import { UserController } from '../controllers/user.controller'
import { DeleteParamsUserType, CreateBodyUserType, GetMultipleQueryUserType, UpdateBodyUserType, UpdateParamsUserType, UpdateMyBodyUserType } from '../schemas/user.schema'
import { literalToBoolean } from '../enums/literalsBoolean.enum'

const controller: UserController = new UserController()

export const fcGetMyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user
  if (userId == null) {
    res.status(400).send({ message: 'ERROR: Invalid Access Token' })
    return
  }
  try {
    const response = await controller.getMyUser(userId)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcUpdateMeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.user
  if (id == null) {
    res.status(400).send({ message: 'ERROR: Invalid Access Token' })
    return
  }
  const body = req.body as UpdateMyBodyUserType
  const avatar = req.file?.path
  try {
    const response = await controller.updateMyUser(id, body, avatar)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcGetMultipleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { active } = req.query as GetMultipleQueryUserType
  const activeBool = literalToBoolean(active)
  try {
    const response = await controller.getMultipleUser(activeBool)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body = req.body as CreateBodyUserType
  const avatar = req.file?.path
  try {
    const response = await controller.createUser(body, avatar)
    res.status(201).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params as UpdateParamsUserType
  const body = req.body as UpdateBodyUserType
  const avatar = req.file?.path
  try {
    const response = await controller.updateUser(id, body, avatar)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params as DeleteParamsUserType
  try {
    const response = await controller.deleteUser(id)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}
