/* eslint-disable no-console */
import app from './app'
import { connectDataBase } from './database'

// Connection DataBase
connectDataBase()
  .then((): void => {
    console.log('DataBase is connected')

    // Execute APP and listen request to PORT
    app.listen(app.get('port'), (): void => {
      console.log(`[SERVER ON]: Running on Port ${app.get('port')}`)
    })
  })
  .catch((_err) => {
    console.log('[Connection Error]')
  })
