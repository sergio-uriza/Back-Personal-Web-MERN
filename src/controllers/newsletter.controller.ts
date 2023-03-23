import { AppError } from '../utils/appError.class'
import Newsletter from '../models/newsletter.model'
import { SuscribeEmailBodyNewsletterType } from '../schemas/newsletter.schema'
import { Route, Tags, Post, Body, Get, Query, Security, Delete, Path } from 'tsoa'
import { GetEmailsNewsletterType, MessageResType, ObjNewsletterType } from './types'

@Route('/newsletter')
@Tags('Newsletter Endpoint')
export class NewsletterController {
  /**
   * Endpoint to obtain the emails registered to the newsletter from the database
   * @param limit maximum number of records to retrieve per page (optional)
   * @param page page number to return (optional)
   * @param order ascending (1) or descending (-1) (optional)
   * @returns List of records in newsletter from database according to the filters applied
   */
  @Security('adminAuth')
  @Get('/')
  public async getEmailsNewsletter (
    @Query() limit = 10, @Query() page = 1, @Query() order = 1
  ): Promise<GetEmailsNewsletterType> {
    const totalDocs = await Newsletter.countDocuments().exec()
    if (limit > totalDocs) limit = totalDocs
    const totalPages = Math.ceil(totalDocs / limit) > 1 && limit !== 0 ? Math.ceil(totalDocs / limit) : 1
    if (page > totalPages) page = totalPages
    const skip = limit === 0 ? totalDocs : (page - 1) * limit

    const docs: ObjNewsletterType[] = await Newsletter.find()
      .sort({ email: order as 1 | -1 })
      .skip(skip)
      .limit(limit)
      .select({ email: 1 })
      .lean()
      .exec()

    return { docs, totalDocs, limit, page, totalPages }
  }

  /**
   * Endpoint to subscribe an email to the newsletter in the database
   * @param body new email to suscribe (required)
   * @returns Message informing if create was correct
   */
  @Post('/')
  public async suscribeEmailNewsletter (
    @Body() body: SuscribeEmailBodyNewsletterType
  ): Promise<MessageResType> {
    const { email } = body
    const duplicateEmail: ObjNewsletterType | null = await Newsletter.findOne({ email: email.toLowerCase() })
      .lean()
      .exec()
    if (duplicateEmail != null) throw new AppError(400, 'Email is already registered')
    await Newsletter.create({ email: email.toLowerCase() })

    return { message: 'Email registered successfully' }
  }

  /**
   * Endpoint to delete an email to the newsletter in the database
   * @param id identifier of the record to delete (required)
   * @returns Message informing if delete was correct
   */
  @Security('adminAuth')
  @Delete('/:id')
  public async deleteEmailNewsletter (
    @Path() id: string
  ): Promise<MessageResType> {
    const newsletter: ObjNewsletterType | null = await Newsletter.findByIdAndDelete(id).lean().exec()

    if (newsletter == null) throw new AppError(400, 'No email found')
    return { message: 'Email delete successfully' }
  }
}
