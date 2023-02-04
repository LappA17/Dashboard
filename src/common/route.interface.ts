import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './interface.middleware';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;

//добавим массив мидлвееров который должен отработать перед тем как мы попадём в сам контроллер
