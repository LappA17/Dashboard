import { IMiddleware } from './interface.middleware';
import { NextFunction, Response, Request } from 'express';

export class Authguard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next(); //если есть юзер, то всё хорошо и мы пропускаем !
		}
		res.status(401).send('You are not authorize !');
	}
}
