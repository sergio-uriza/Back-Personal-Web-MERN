import { Request, Response, NextFunction } from 'express'
import { ObjUserType } from '../controllers/types'
import { UserRole } from '../enums/userRole.enum'
import User from '../models/user.model'

export const adminExistence = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user

  if (userId == null) {
    res.status(400).send({ message: 'Invalid Token Error' })
    return
  }

  User.findById(userId)
    .select({ _id: 0, email: 1, active: 1, role: 1 })
    .lean()
    .then((userFound: ObjUserType | null) => {
      if (userFound == null) {
        res.status(401).send({ message: 'Non-existent User' })
        return
      }
      if (userFound.role !== UserRole.ADMIN) {
        res.status(403).send({
          message: 'You do not have the necessary administrator credentials'
        })
        return
      }
      if (!userFound.active) {
        res.status(403).send({
          message: 'Your administrator privileges are inactive'
        })
        return
      }

      next()
    })
    .catch((_err) => {
      res.status(500).send({ message: 'Something is wrong, try again later' })
    })
}

export const userExistence = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user

  if (userId == null) {
    res.status(400).send({ message: 'Invalid Token Error' })
    return
  }

  User.findById(userId)
    .select({ _id: 0, email: 1, active: 1, role: 1 })
    .lean()
    .then((userFound: ObjUserType | null) => {
      if (userFound == null) {
        res.status(401).send({ message: 'Non-existent User' })
        return
      }
      if (!userFound.active) {
        res.status(403).send({
          message: 'Your user privileges are inactive'
        })
        return
      }

      next()
    })
    .catch((_err) => {
      res.status(500).send({ message: 'Something is wrong, try again later' })
    })
}
