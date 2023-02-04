import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { LoggerService } from '../logger/logger.service';
import { IExeptionFilter } from './exeption.filter.interface';
import { HTTPError } from './http-error.class';
import 'reflect-metadata';
import { TYPES } from '../types';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
/*
logger: ILogger
constructor(logger: ILogger) {
	this.logger = logger
} 
Мы убарли этот Логгер, потому что на текущий момент наш ЛоггерСервис явно передается, но мы этого делать не можем так как мы работает с контейнером и нам необходимо сообщить контейнеру что в это место нужно вставить ЛоггерСервис
И для этого мы убрали тот АйЛоггер и добавили декоратор 
@inject(TYPES.ILogger) - благодаря такому инжекту на это место подставится инстенс Логгера
*/
