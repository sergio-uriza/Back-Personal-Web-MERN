export class AppError extends Error {
  status: number

  constructor (status: number, message: string) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)
    this.name = 'AppError'
    this.status = status
    Error.captureStackTrace(this)
  }
}
