import { HttpCode } from "./HttpCode"
import { CustomError } from "./CustomError"

export class DataBaseServerError extends CustomError {
  constructor({ message }: { message: string }) {
    if (message === 'ECONNREFUSED') {// db 연결실패
      message = 'Database Connect Fail'
    }
    else if (message === 'ER_ACCESS_DENIED_ERROR') {// db 로그인 권한 없음
      message = 'Database Connect Fail'
    }
    else if (message === 'EHOSTUNREACH') {// db 연결실패 - config 정보 문제
      message = 'Database Connect Fail. Please check db config data'
    }
    else if (message === 'PROTOCOL_ENQUEUE_AFTER_QUIT') {//  db 연결실패 - db 연결종료후 이어서 연결 시도하는 경우
      message = 'Database Connect Fail'
    }
    else if (message === 'ER_NO_SUCH_TABLE') {//  table 존재하지 않음
      message = 'Query Syntax Error'
    }
    else if (message === 'ER_PARSE_ERROR' || message === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {//  쿼리문 에러
      message = 'Query Syntax Error'
    }
    else if (message === 'ER_LOCK_WAIT_TIMEOUT') {
      message = 'Database Transection Error'
    }
    else message = 'Database Error'
    super({ message, statusCode: HttpCode.INTERNAL_SERVER_ERROR })	// 500
  }
}