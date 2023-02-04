import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { IUserService } from './users.service.interface';
import { Authguard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new Authguard()],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			return next(new HTTPError(401, 'ошибка авторизации', 'login'));
		}
		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
/*
Вызввать в конструкторе UserController bindRoutes и прибиндить сюда то что у нас сейчас находится к примеру логин и регистр к соответсвующим фция в этом контроллере + добавить в app.ts и вместо userRouter передать нужный инстенс контроллера

Нам нужно забиндить login и register в this.bindRoutes и мы передаем в него

ТАК КАК МЫ СОЗДАЛИ users.controller.ts НАМ ЭТОТ ФАЙЛ users.ts БОЛЬШЕ НЕ НУЖЕН

//
Теперь что бы обработать ошибку такую запись мы использовать уже не можем
register(req: Request, res: Response, next: NextFunction) {
		this.ok(res, 'register')
	}
Нам нужно вызвать фцию next() - что бы передать следующему обработчику

next(new HTTPError(401, 'AUTHORIZATION ERROR')) - вот таким вот образом мы можем вызвать передачу ошибки с определнный кодом, нашему обработчику exeption.filter. Експешенфилтер уже берёт эту ошибку и вметоде catch ее обрабатывает с помощью логгирования и ответа

//
@inject(TYPES.ILogger) private loggerService: ILogger) - мы добавили loggerService вместо looger потому что он везде был назван Логгер и везде есть приватное свойство логгер, по-этому логгерСерв и тогда объявления логгера и логгерСервиса не будет пересикатся в двух классах

//
req: Request - реквест от экспресса на самом деле принимает три дженерика. И нам сейчас нужен третий - это ReqBody - то бади который к нам будет приходить методом post(хотя необязательно пост, может для логина будет путт а для регистра пост)
console.log(req.body); - этот боди и будет userLoginDTO и мы можем его использовать уже для консруирования пользователя или из него передать данные для сохранения
Таким образом мы стандартизировали контракты взаимодействия между нашим фронтом который будет взаимодействовать с пользователем и нашим бекендом который будет эти контракты использовать. Более того мы можем шарить эти дтошки между фронтом и бекендом, мы можем вынести их в контракты и использовать их на фронте как контракты которые нужно передать

По-умолчанию нащ экспресс не знает как правильно стериализовать body, по-этому мы установим дополнительный middleware в виде body-parser
Тепреь из этого бодипарсера нам нужно импортировать json метод(фцию которая будет) стерелозавать наш текущий body в json

//
что бы не писать req.body, сделаем сразу {body} дистркутуризацию

// Мы больше не пишем бизнесс логику в контроллере, а переносим её в Сервис
const newUser = new User(body.email, body.name); // создаем нового пользователя
await newUser.setPassword(body.password); // добавялем ему пароль
Теперь эта прослойка в controller отвечает за то что мы получает, преобразуем и передаём в бизнес логику
ВОТ ЭТО РАБОТА КОНТРОЛЛЕРА ! НИКАКОЙ БИЗНЕС ЛОГИКИ, ТОЛЬКО ПРЕОБРАЗОВАНИЕ, 
КОНТРОЛЛЕР ОТВЕЧАЕТ ЗА ВЗАИМОДЕЙСТВИЕ ВХОДНЫХ И ВЫХОДНЫХ ДАННЫХ

//middleware
{ path: '/register', method: 'post', func: this.register, middlewares: [] }, сюда в конец передаем набор мидлвееров которые будут обрабатывать наши роуты

middlewares: [new ValidateMiddleware(UserRegisterDto)], - мы передаем то что мы должны провалидировать и на каком классе(UserRegisterDto)

// JWT
фция sign само по себе это коллбек, по-этому мы ее обернум а async await

помимо iat важн
*/
