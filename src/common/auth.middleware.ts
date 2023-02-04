import { IMiddleware } from './interface.middleware';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload: any) => {
				if (err) {
					next();
				} else if (payload) {
					req.user = payload.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}

/* Если мы прям так и оставим req.user = payload.email; то ТС будет на нас ругаться, потому что в Экспресса нет у req поле user 
Но нам нужно наш Реквест обогатить и в этом нет ничего плохо, но наш тс не позволит нам это сделать
Для этого создадим папку types на уровне scr и там дтску для доп типизации */
