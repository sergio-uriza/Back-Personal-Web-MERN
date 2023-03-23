import { NextFunction, Request, Response } from 'express'
import { BlogController } from '../controllers/blog.controller'
import { CreateBodyBlogType, DeleteParamsBlogType, GetMultipleQueryBlogType, GetByPathParamsBlogType, UpdateBodyBlogType, UpdateParamsBlogType } from '../schemas/blog.schema'

const controller: BlogController = new BlogController()

export const fcGetMyMultipleBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { limit, page } = req.query as GetMultipleQueryBlogType
  const userId = req.user
  if (userId == null) {
    res.status(400).send({ message: 'ERROR: Invalid Access Token' })
    return
  }
  try {
    const response = await controller.getMyMultipleBlog(userId, limit, page)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcUpdateMyBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params as UpdateParamsBlogType
  const body = req.body as UpdateBodyBlogType
  const miniature = req.file?.path
  const userId = req.user
  if (userId == null) {
    res.status(400).send({ message: 'ERROR: Invalid Access Token' })
    return
  }
  try {
    const response = await controller.updateMyBlog(userId, id, body, miniature)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcDeleteMyBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params as DeleteParamsBlogType
  const userId = req.user
  if (userId == null) {
    res.status(400).send({ message: 'ERROR: Invalid Access Token' })
    return
  }
  try {
    const response = await controller.deleteMyBlog(userId, id)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcGetByPathBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { path } = req.params as GetByPathParamsBlogType
  try {
    const response = await controller.getByPathBlog(path)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcGetMultipleBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { limit, page } = req.query as GetMultipleQueryBlogType
  try {
    const response = await controller.getMultipleBlog(limit, page)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcCreateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body = req.body as CreateBodyBlogType
  const miniature = req.file?.path
  const userId = req.user as string
  try {
    const response = await controller.createBlog(userId, body, miniature)
    res.status(201).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcUpdateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params as UpdateParamsBlogType
  const body = req.body as UpdateBodyBlogType
  const miniature = req.file?.path
  try {
    const response = await controller.updateBlog(id, body, miniature)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcDeleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params as DeleteParamsBlogType
  try {
    const response = await controller.deleteBlog(id)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}
