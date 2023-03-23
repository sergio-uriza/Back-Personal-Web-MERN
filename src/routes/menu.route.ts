import { NextFunction, Request, Response } from 'express'
import { MenuController } from '../controllers/menu.controller'
import { literalToBoolean } from '../enums/literalsBoolean.enum'
import { CreateBodyMenuType, DeleteParamsMenuType, GetMultipleQueryMenuType, UpdateBodyMenuType, UpdateParamsMenuType } from '../schemas/menu.schema'

const controller: MenuController = new MenuController()

export const fcGetMultipleMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { active } = req.query as GetMultipleQueryMenuType
  const activeBool = literalToBoolean(active)
  try {
    const response = await controller.getMultipleMenu(activeBool)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcCreateMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body = req.body as CreateBodyMenuType
  try {
    const response = await controller.createMenu(body)
    res.status(201).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcUpdateMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params as UpdateParamsMenuType
  const body = req.body as UpdateBodyMenuType
  try {
    const response = await controller.updateMenu(id, body)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcDeleteMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params as DeleteParamsMenuType
  try {
    const response = await controller.deleteMenu(id)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}
