import { Route, Tags, Security, Body, Request, Post, Get, Query, Path, Patch, Delete } from 'tsoa'
import Course from '../models/course.model'
import { CreateBodyCourseType, UpdateBodyCourseType } from '../schemas/course.schema'
import { ObjCourseType } from './types'

@Route('/course')
@Tags('CourseController')
export class CourseController {
  /**
   * Endpoint to obtain the data of courses from database
   * @param limit maximum number of courses to retrieve per page (optional)
   * @param page page number to return (optional)
   * @returns Course data according to the filters applied
   */
  @Get('/')
  public async getCourses (@Query() limit = 10, @Query() page = 1) {
    const numCourses = await Course.countDocuments().exec()
    if (limit === 0 || limit > numCourses) limit = numCourses
    const pages = Math.ceil(numCourses / limit) > 1 ? Math.ceil(numCourses / limit) : 1
    if (page > pages) page = pages

    const courses: ObjCourseType[] = await Course.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .select({ title: 1, description: 1, url: 1, price: 1, score: 1, miniature: 1 })
      .lean()
      .exec()

    return { docs: courses, total: numCourses, limit, page, pages }
  }

  /**
   * Endpoint to create courses in datatbase
   * @param body new course parameters (required)
   * @param miniature new course miniature (optional)
   * @returns Data of the new course created
   */
  @Security('bearerAuth')
  @Post('/')
  public async createCourse (@Body() body: CreateBodyCourseType, @Request() miniature?: string) {
    const course = await Course.create({ ...body, miniature })

    const objCourse: ObjCourseType = course.toObject({ versionKey: false })
    return objCourse
  }

  /**
   * Endpoint to partially update course information from the database
   * @param id identifier of the course to modify (required)
   * @param body parameters of the course to modify (Optional)
   * @param miniature image of the course to modify (Optional)
   * @returns Message informing if update was correct
   */
  @Security('bearerAuth')
  @Patch('/:id')
  public async updateCourse (@Path() id: string, @Body() body: UpdateBodyCourseType, @Request() miniature?: string) {
    const modifyCourse = { ...body, miniature }
    await Course.findByIdAndUpdate(id, modifyCourse, { runValidators: true, new: true }).exec()

    return { message: 'Course update successfully' }
  }

  /**
   * Endpoint to delete course information from the database
   * @param id identifier of the course to delete (required)
   * @returns Message informing if delete was correct
   */
  @Security('bearerAuth')
  @Delete('/:id')
  public async deleteCourse (@Path() id: string) {
    await Course.findByIdAndDelete(id).exec()
    return { message: 'Course delete successfully' }
  }
}
