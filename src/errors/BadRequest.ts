import { HttpCode } from "./HttpCode"
import { CustomError } from "./CustomError"

export class BadRequest extends CustomError {
  constructor(message: string) {
    // HttpCode는 열거형(enum) 데이터, BAD_REQUEST:400
    super({ message, statusCode: HttpCode.BAD_REQUEST })
  }
}