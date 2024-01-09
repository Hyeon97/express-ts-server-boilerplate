import { HttpCode } from "./HttpCode"
import { CustomError } from "./CustomError"

export class InternalServerError extends CustomError {
  constructor(message: string) {
    super({ message, statusCode: HttpCode.INTERNAL_SERVER_ERROR })	// 500
  }
}