import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

// custom decorator
export function Serialize(dto: ClassConstructor<unknown>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor<unknown>) { }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // run  before route handler

    return next.handle().pipe(
      map((data: unknown) => {
        //  run smth before the response is sent out

        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true
        });
      })
    );
  }

}