import Course from '../models/course.model'
import { AppError } from '../utils/appError.class'
import { GetMultipleCourseType, MessageResType, ObjCourseType } from './types'
import { CreateBodyCourseType, UpdateBodyCourseType } from '../schemas/course.schema'
import { Route, Tags, Security, Body, Request, Post, Get, Query, Path, Patch, Delete } from 'tsoa'
import fs from 'fs-extra'
import path from 'path'

@Route('/course')
@Tags('Course Endpoint')
export class CourseController {
  /**
   * Endpoint to get the paginated courses from the database
   * @param limit maximum number of courses to retrieve per page (optional)
   * @param page page number to return (optional)
   * @returns Courses data according to the filters applied
   */
  @Get('/')
  public async getMultipleCourse (
    @Query() limit = 10, @Query() page = 1
  ): Promise<GetMultipleCourseType> {
    const totalDocs = await Course.countDocuments().exec()
    if (limit > totalDocs) limit = totalDocs
    const totalPages = Math.ceil(totalDocs / limit) > 1 && limit !== 0 ? Math.ceil(totalDocs / limit) : 1
    if (page > totalPages) page = totalPages
    const skip = limit === 0 ? totalDocs : (page - 1) * limit

    const docs: ObjCourseType[] = await Course.find()
      .skip(skip)
      .limit(limit)
      .select({ title: 1, description: 1, url: 1, price: 1, score: 1, miniature: 1 })
      .lean()
      .exec()

    return { docs, totalDocs, limit, page, totalPages }
  }

  /**
   * Endpoint to create a course in the database
   * @param body new course parameters (required)
   * @param miniature new course miniature (optional)
   * @returns Data of the new course created
   */
  @Security('adminAuth')
  @Post('/')
  public async createCourse (
    @Body() body: CreateBodyCourseType, @Request() miniature?: string
  ): Promise<MessageResType> {
    const newCourse = { ...body, miniature }
    await Course.create(newCourse)
    // const objCourse: ObjCourseType = course.toObject({ versionKey: false })

    return { message: 'Course create successfully' }
  }

  /**
   * Endpoint to partially update course information from the database
   * @param id identifier of the course to modify (required)
   * @param body parameters of the course to modify (Optional)
   * @param miniature image of the course to modify (Optional)
   * @returns Message informing if update was correct
   */
  @Security('adminAuth')
  @Patch('/:id')
  public async updateCourse (
    @Path() id: string, @Body() body: UpdateBodyCourseType, @Request() miniature?: string
  ): Promise<MessageResType> {
    const modifyCourse = { ...body, miniature }
    const oldCourse: ObjCourseType | null = await Course.findByIdAndUpdate(id, modifyCourse, { runValidators: true, context: 'query' })
      .lean()
      .exec()

    if (oldCourse == null) throw new AppError(400, 'No course found')
    if (miniature != null && oldCourse.miniature != null) {
      const isExistFile = await fs.exists(path.resolve(oldCourse.miniature))
      if (isExistFile) await fs.unlink(path.resolve(oldCourse.miniature))
    }
    return { message: 'Course update successfully' }
  }

  /**
   * Endpoint to delete course information from the database
   * @param id identifier of the course to delete (required)
   * @returns Message informing if delete was correct
   */
  @Security('adminAuth')
  @Delete('/:id')
  public async deleteCourse (
    @Path() id: string
  ): Promise<MessageResType> {
    const course: ObjCourseType | null = await Course.findByIdAndDelete(id).lean().exec()

    if (course == null) throw new AppError(400, 'No course found')
    if (course.miniature != null) {
      const isExistFile = await fs.exists(path.resolve(course.miniature))
      if (isExistFile) await fs.unlink(path.resolve(course.miniature))
    }
    return { message: 'Course delete successfully' }
  }
}
