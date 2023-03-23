import Blog from '../models/blog.model'
import { IUser } from '../models/user.model'
import { AppError } from '../utils/appError.class'
import { CreateBodyBlogType, UpdateBodyBlogType } from '../schemas/blog.schema'
import { Route, Tags, Security, Body, Request, Post, Get, Query, Patch, Path, Delete } from 'tsoa'
import { GetMultipleBlogType, GetMyMultipleBlogType, MessageResType, ObjBlogPopulateType, ObjBlogType, ObjMyBlogType } from './types'
import fs from 'fs-extra'
import path from 'path'

@Route('/blog')
@Tags('Blog Endpoint')
export class BlogController {
  /**
   * Endpoint to get the paginated blogs of the user who makes the request in the database
   * @param userId id of the creator user contained in the credentials (required)
   * @param limit maximum number of blogs to retrieve per page (optional)
   * @param page page number to return (optional)
   * @returns Blogs data (from the newest to the oldest) according to the filters applied
   */
  @Security('userAuth')
  @Get('/my')
  public async getMyMultipleBlog (
    @Request() userId: string, @Query() limit = 10, @Query() page = 1
  ): Promise<GetMyMultipleBlogType> {
    const totalDocs = await Blog.countDocuments({ user: userId }).exec()
    if (limit > totalDocs) limit = totalDocs
    const totalPages = Math.ceil(totalDocs / limit) > 1 && limit !== 0 ? Math.ceil(totalDocs / limit) : 1
    if (page > totalPages) page = totalPages
    const skip = limit === 0 ? totalDocs : (page - 1) * limit

    const docs: ObjMyBlogType[] = await Blog.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select({ title: 1, content: 1, path: 1, createdAt: 1, miniature: 1 })
      .lean()
      .exec()

    return { docs, totalDocs, limit, page, totalPages }
  }

  /**
   * Endpoint to partially update a blog of the user who makes the request in the database
   * @param userId id of the creator user contained in the credentials (required)
   * @param id identifier of the blog to modify (required)
   * @param body parameters of the blog to modify (Optional)
   * @param miniature image of the blog to modify (Optional)
   * @returns Message informing if update was correct
   */
  @Security('userAuth')
  @Patch('/my/:id')
  public async updateMyBlog (
    @Request() userId: string, @Path() id: string, @Body() body: UpdateBodyBlogType, @Request() miniature?: string
  ): Promise<MessageResType> {
    const modifyBlog = { ...body, miniature }
    const blog: ObjBlogType | null = await Blog.findOneAndUpdate({ _id: id, user: userId }, modifyBlog, { runValidators: true, new: true, context: 'query' })
      .lean()
      .exec()

    if (blog == null) throw new AppError(400, 'No personal blog found')
    return { message: 'Personal blog update successfully' }
  }

  /**
   * Endpoint to delete a blog of the user who makes the request in the database
   * @param userId id of the creator user contained in the credentials (required)
   * @param id identifier of the blog to delete (required)
   * @returns Message informing if delete was correct
   */
  @Security('userAuth')
  @Delete('/my/:id')
  public async deleteMyBlog (
    @Request() userId: string, @Path() id: string
  ): Promise<MessageResType> {
    const blog: ObjBlogType | null = await Blog.findOneAndDelete({ _id: id, user: userId })
      .lean()
      .exec()

    if (blog == null) throw new AppError(400, 'No personal blog found')
    if (blog.miniature != null) {
      const isExistFile = await fs.exists(path.resolve(blog.miniature))
      if (isExistFile) await fs.unlink(path.resolve(blog.miniature))
    }
    return { message: 'Personal blog delete successfully' }
  }

  /**
   * Endpoint to obtain the data of a blog from the database
   * @param path Unique path of the blog to retrieve (required)
   * @returns Blog data or message if not found
   */
  @Get('/:path')
  public async getByPathBlog (
    @Path() path: string
  ): Promise<ObjBlogPopulateType> {
    const blog: ObjBlogPopulateType | null = await Blog.findOne({ path })
      .select({ _id: 1, title: 1, content: 1, path: 1, user: 1, createdAt: 1, miniature: 1 })
      .populate<{ user: IUser }>({ path: 'user', select: { _id: 0, firstname: 1, lastname: 1 } })
      .lean()
      .exec()

    if (blog == null) throw new AppError(400, 'No blog found')
    return blog
  }

  /**
   * Endpoint to get the paginated blogs data from the database
   * @param limit maximum number of blogs to retrieve per page (optional)
   * @param page page number to return (optional)
   * @returns Blogs data (from the newest to the oldest) according to the filters applied
   */
  @Get('/')
  public async getMultipleBlog (
    @Query() limit = 10, @Query() page = 1
  ): Promise<GetMultipleBlogType> {
    const totalDocs = await Blog.countDocuments().exec()
    if (limit > totalDocs) limit = totalDocs
    const totalPages = Math.ceil(totalDocs / limit) > 1 && limit !== 0 ? Math.ceil(totalDocs / limit) : 1
    if (page > totalPages) page = totalPages
    const skip = limit === 0 ? totalDocs : (page - 1) * limit

    const docs: ObjBlogPopulateType[] = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select({ title: 1, content: 1, path: 1, user: 1, createdAt: 1, miniature: 1 })
      .populate<{ user: IUser }>({ path: 'user', select: { _id: 0, firstname: 1, lastname: 1 } })
      .lean()
      .exec()

    return { docs, totalDocs, limit, page, totalPages }
  }

  /**
   * Endpoint to create blogs in the database
   * @param userId id of the user creator contained in the credentials (required)
   * @param body new blog parameters (required)
   * @param miniature new blog miniature (optional)
   * @returns Data of the new blog created
   */
  @Security('userAuth')
  @Post('/')
  public async createBlog (
    @Request() userId: string, @Body() body: CreateBodyBlogType, @Request() miniature?: string
  ): Promise<MessageResType> {
    const newBlog = { ...body, user: userId, createdAt: new Date(), miniature }
    await Blog.create(newBlog)
    // const objBlog: ObjBlogType = blog.toObject({ versionKey: false })

    return { message: 'Blog create successfully' }
  }

  /**
   * Endpoint to partially update blog information from the database
   * @param id identifier of the blog to modify (required)
   * @param body parameters of the blog to modify (Optional)
   * @param miniature image of the blog to modify (Optional)
   * @returns Message informing if update was correct
   */
  @Security('adminAuth')
  @Patch('/:id')
  public async updateBlog (
    @Path() id: string, @Body() body: UpdateBodyBlogType, @Request() miniature?: string
  ): Promise<MessageResType> {
    const modifyBlog = { ...body, miniature }
    const oldBlog: ObjBlogType | null = await Blog.findByIdAndUpdate(id, modifyBlog, { runValidators: true, context: 'query' })
      .lean()
      .exec()

    if (oldBlog == null) throw new AppError(400, 'No blog found')
    if (miniature != null && oldBlog.miniature != null) {
      const isExistFile = await fs.exists(path.resolve(oldBlog.miniature))
      if (isExistFile) await fs.unlink(path.resolve(oldBlog.miniature))
    }
    return { message: 'Blog update successfully' }
  }

  /**
   * Endpoint to delete blog information from the database
   * @param id identifier of the blog to delete (required)
   * @returns Message informing if delete was correct
   */
  @Security('adminAuth')
  @Delete('/:id')
  public async deleteBlog (
    @Path() id: string
  ): Promise<MessageResType> {
    const blog: ObjBlogType | null = await Blog.findByIdAndDelete(id).lean().exec()

    if (blog == null) throw new AppError(400, 'No blog found')
    if (blog.miniature != null) {
      const isExistFile = await fs.exists(path.resolve(blog.miniature))
      if (isExistFile) await fs.unlink(path.resolve(blog.miniature))
    }
    return { message: 'Blog delete successfully' }
  }
}
