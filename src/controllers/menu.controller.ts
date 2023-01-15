import { Route, Tags, Security, Post, Body, Query, Get, Path, Patch, Delete } from 'tsoa'
import Menu from '../models/menu.model'
import { CreateBodyMenuType, UpdateBodyMenuType } from '../schemas/menu.schema'

@Route('/menu')
@Tags('MenuController')
export class MenuController {
  /**
   * Endpoint to obtain the data of menus from database
   * @param active active menus filter you want to get (true or false) (Optional)
   * @returns Information of all menus with or without filters
   */
  @Get('/')
  public async getMenu (@Query() active?: boolean) {
    if (active === undefined) {
      return await Menu.find()
        .sort({ order: 1 })
        .select({ title: 1, path: 1, order: 1, active: 1 })
        .exec()
    } else {
      return await Menu.find({ active })
        .sort({ order: 1 })
        .select({ title: 1, path: 1, order: 1, active: 1 })
        .exec()
    }
  }

  /**
   * Endpoint to create menu from database
   * @param body parameter to new menu (required)
   * @returns Data of the new menu
   */
  @Security('bearerAuth')
  @Post('/')
  public async createMenu (@Body() body: CreateBodyMenuType) {
    const menu = await Menu.create(body)
    return menu
  }

  /**
   * Endpoint to partially update menu information from the database
   * @param id identifier of the menu to modify (required)
   * @param body parameters of the menu to modify (Optional)
   * @returns Message informing if update was correct
   */
  @Security('bearerAuth')
  @Patch('/:id')
  public async updateMenu (@Path() id: string, @Body() body: UpdateBodyMenuType) {
    await Menu.findByIdAndUpdate(id, body, { runValidators: true, new: true })
    return { message: 'Menu update successfully' }
  }

  /**
   * Endpoint to delete menu information from the database
   * @param id identifier of the menu to delete (required)
   * @returns Message informing if delete was correct
   */
  @Security('bearerAuth')
  @Delete('/:id')
  public async deleteMenu (@Path() id: string) {
    await Menu.findByIdAndDelete(id)
    return { message: 'Menu delete successfully' }
  }
}
