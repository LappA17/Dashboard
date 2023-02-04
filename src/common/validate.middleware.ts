import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Response, Request } from 'express';
import { IMiddleware } from './interface.middleware';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, body);
		//будет вызывать валидация от класса который мы выше инстанцировали
		validate(instance).then(errors => {
			//проверяем есть ли ошибки
			if (errors.length > 0) {
				res.status(422).send(errors);
			} else {
				//если ошибок нет, вызываем фцию next и переходим к следующеми обработчику
				next();
			}
		});
	}
}

/*
Нам нужно взять сырок body который является Объектом, взять и переобразавать вот к этому классу ClassConstructor
plainToClass() - эта фция преобразовывает наш конкретный Объект к классу-трансформеру
const instance = plainToClass(this.classToValidate, body); - у нас в результате будет инстанцеированный класс с помощью данных, которые мы отправили в body  */
