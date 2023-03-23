import Menu from '../models/menu.model'
import { AppError } from '../utils/appError.class'
import { MessageResType, ObjMenuType } from './types'
import { CreateBodyMenuType, UpdateBodyMenuType } from '../schemas/menu.schema'
import { Route, Tags, Security, Post, Body, Query, Get, Path, Patch, Delete } from 'tsoa'

@Route('/menu')
@Tags('Menu Endpoint')
export class MenuController {
  /**
   * Endpoint to obtain the data of menus from the database
   * @param active active menus filter you want to get (true or false) (Optional)
   * @returns Information of all menus with or without filters
   */
  @Get('/')
  public async getMultipleMenu (
    @Query() active?: boolean
  ): Promise<ObjMenuType[]> {
    if (active === undefined) {
      const allMenu: ObjMenuType[] = await Menu.find()
        .sort({ order: 1 })
        .select({ title: 1, path: 1, order: 1, active: 1 })
        .lean()
        .exec()

      return allMenu
    } else {
      const activeMenu: ObjMenuType[] = await Menu.find({ active })
        .sort({ order: 1 })
        .select({ title: 1, path: 1, order: 1, active: 1 })
        .lean()
        .exec()

      return activeMenu
    }
  }

  /**
   * Endpoint to create a menu in the database
   * @param body parameters to new menu (required)
   * @returns Data of the new menu
   */
  @Security('adminAuth')
  @Post('/')
  public async createMenu (
    @Body() body: CreateBodyMenuType
  ): Promise<MessageResType> {
    await Menu.create(body)
    // const objMenu: ObjMenuType = menu.toObject({ versionKey: false })

    return { message: 'Menu create successfully' }
  }

  /**
   * Endpoint to partially update menu information from the database
   * @param id identifier of the menu to modify (required)
   * @param body parameters of the menu to modify (Optional)
   * @returns Message informing if update was correct
   */
  @Security('adminAuth')
  @Patch('/:id')
  public async updateMenu (
    @Path() id: string, @Body() body: UpdateBodyMenuType
  ): Promise<MessageResType> {
    const menu: ObjMenuType | null = await Menu.findByIdAndUpdate(id, body, { runValidators: true, new: true, context: 'query' })
      .lean()
      .exec()

    if (menu == null) throw new AppError(400, 'No menu found')
    return { message: 'Menu update successfully' }
  }

  /**
   * Endpoint to delete menu information from the database
   * @param id identifier of the menu to delete (required)
   * @returns Message informing if delete was correct
   */
  @Security('adminAuth')
  @Delete('/:id')
  public async deleteMenu (
    @Path() id: string
  ): Promise<MessageResType> {
    const menu: ObjMenuType | null = await Menu.findByIdAndDelete(id).lean().exec()

    if (menu == null) throw new AppError(400, 'No menu found')
    return { message: 'Menu delete successfully' }
  }
}
