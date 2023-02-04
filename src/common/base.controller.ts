import { Response, Router } from 'express';
import { injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { LoggerService } from '../logger/logger.service';
import { ExpressReturnType, IControllerRoute } from './route.interface';
export { Router } from 'express';
import 'reflect-metadata';

@injectable() // потому что UserController extends BaseController и если мы не зададим BaseController то работать не будет
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map(m => m.execute.bind(m)); //бинд на самого себя, что бы не терять контекст
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}

/*
Почему наш контроллер базовый - во первых он должен быть абстрактный, что бы мы не могли создать инстенс без реализации каких-то вещей. во-вторых мы будем от него наследоваться но часть функционала мы должны заимплементировать в базовый контроллер

Нам нужно сделать метод благодаря которому мы будем делать биндинг фций, которые находятся в классе к некоторым Роутам.
Эта фция будет protected
protected bindRoutes(routes) - передаём роуты, которые будем биндить
Нам нужно пройтись по этим роутам и сделать соотвествие, что бы наш this.router

если писать совсем правильно то создаем method 2
Pick<Router, 'get' | 'post' | 'delete' | 'put' | 'patch'> - таким образом мы создали интерфейс из Роутера экспресса который состоит только из этих переданных методов
Но так как это пока что просто интерфейс то нам нужно сделать keyof Pick<Router, 'get' | 'post' | 'delete' | 'put' | 'patch'>
Если мы где-то здесь опечатаемся method: 'get' | 'post' | 'delete' | 'put' | 'patch' к примеру не patch, а paatch то тс нам ошбику не выдаст, но в том примере с кейоф и пик ошибка будет еще на компиляции

this.router[route.method]() - ControllerRoute.method: "get" | "post" | "delete" | "put" | "patch" то-есть на место [route.method] подставится какой-то метод

На данном этапе единственная проблема которая у нас будет - что мы потеряли контекст
Это означает что когда мы здесь this.router[route.method](route.path, route.func) передаем какуе-то фцию route.func, то мы на самом деле полностью потеряли контекст нашего исходного класса, из которого она вышла, когда мы дальше будем вызывать фцию то она будет относится не к базовому контроллеру BaseController, а к this как к фции которая находится внутри экспресса к этой экспресс фции func
По-этому перед тем как передавать сюда фцию this.router[route.method](route.path, route.func) нужно сохранить ее контекст
const handler = route.func.bind(this)

В аpp.ts 
Здесь отрефакторим на 
useRoutes() {
	this.app.use('/users', this.userController.router)
}

main.ts 
Здесь мы начинаем строить дерево зависимостей
const logger = new LoggerService()
const app = new App(logger, new UserController(logger))

//
const pipeline = middleware ? [...middleware, handler] : handler; - будет создавать из одного хендлера если у нас нет мидлвееров, а если мидлвееры есть то сначала идут они а потом хендлеры
*/
