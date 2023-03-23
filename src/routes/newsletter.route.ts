import { NextFunction, Request, Response } from 'express'
import { NewsletterController } from '../controllers/newsletter.controller'
import { DeleteEmailParamsNewsletterType, GetEmailsQueryNewsletterType, SuscribeEmailBodyNewsletterType } from '../schemas/newsletter.schema'

const controller: NewsletterController = new NewsletterController()

export const fcGetEmailsNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { limit, page, order } = req.query as GetEmailsQueryNewsletterType
  try {
    const response = await controller.getEmailsNewsletter(limit, page, order)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcSuscribeEmailNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body = req.body as SuscribeEmailBodyNewsletterType
  try {
    const response = await controller.suscribeEmailNewsletter(body)
    res.status(201).send(response)
  } catch (err) {
    next(err)
  }
}

export const fcDeleteEmailNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params as DeleteEmailParamsNewsletterType
  try {
    const response = await controller.deleteEmailNewsletter(id)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}
