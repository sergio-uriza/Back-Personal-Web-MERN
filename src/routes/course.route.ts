import { NextFunction, Request, Response } from 'express'
import { CourseController } from '../controllers/course.controller'
import { CreateBodyCourseType, DeleteParamsCourseType, GetMultipleQueryCourseType, UpdateBodyCourseType, UpdateParamsCourseType } from '../schemas/course.schema'

const controller: CourseController = new CourseController()

export const fcGetMultipleCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { limit, page } = req.query as GetMultipleQueryCourseType
  try {
    const response = await controller.getMultipleCourse(limit, page)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcCreateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body = req.body as CreateBodyCourseType
  const miniature = req.file?.path
  try {
    const response = await controller.createCourse(body, miniature)
    res.status(201).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcUpdateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params as UpdateParamsCourseType
  const body = req.body as UpdateBodyCourseType
  const miniature = req.file?.path
  try {
    const response = await controller.updateCourse(id, body, miniature)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcDeleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params as DeleteParamsCourseType
  try {
    const response = await controller.deleteCourse(id)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}
