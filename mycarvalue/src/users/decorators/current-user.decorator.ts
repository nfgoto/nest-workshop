import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// cannot use DI with param decorators
// use an interceptor to get user from user service and pass it to the decorator    

export const CurrentUser = createParamDecorator(
  // context = incoming request
  // data: is argument passed to decorator
  // return will be passed to the argument in route handler
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  }
)