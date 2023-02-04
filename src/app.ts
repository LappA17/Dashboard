import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { json } from 'body-parser';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { UserController } from './users/users.controller';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
/*
init - это будет публичный метод, потому что кто-то будет вызывать и собирать наше приложение */

/*
request -> middleware -> controller -> service -> respository -> service -> controller -> exception handler -> response
У нас есть запрос который отправляет пользователь
Всё приложение будет реализована в классе App. Внутри будут различные её элементы. Важная особенность нашего приложения - должна быть возможность отделить кажлый из этих элемнетов от нашего приложения и протестировать отдельно.
После запроса он обрабатывает мидлвеером
Контроллер отвечает за то как у нас обрабатывается входящий запрос, его приобразование и передача дальнейшим в сервис. Когда контроллер начинает работать с данными - ему необходимо пойти в базу данных. Плохой паттерн когда контроллер напрямую идет в наш репозиторий, потому что репозиторий может поменяться + в контроллере не должно быть какой-то логики, которая относится к бизнес части, всё логика слоенный архитектуры должна реализоваться в сервисах
Сервис - отдельный класс, который вызывается из контроллера и дальше общается с репозиторием. Тем самым мы отделаяем промежуточную обработку на фоне мидлвеер, самого обработки запросса на уровне контроллера, дальше сервис - это бизнес логика и дальше работа с базой данный - репозиторий, дальше репозиторий после того как получит данные отвечает сервису, сервис вернул данные в контроллер и контроллер уже отвечает
Такой подход даёт нам возможность сделать нашу логику легко заменяемой, потому что если что-то меняем в базе данных, к примеру меняем mySql на mongoDB, то мы только меняем репозиторий и как он работает с БД и всё ! 

// важной особеностью является наличие типов при эмите, не используя рефлект метадату мы не сможем отправить никакую информацию и получить, по-этому во все те места где у нас есть декораторы, мы должны добавить импорт рефлект методата. Но это сказал Антон в своём видео, у меня всё заработало и без импорта reflect-metadata но я уже её оставлю на всякий

//
useMiddleware(): void {
		this.app.use(json())
	}
Таким образом мы добавили для всего приложения json парсер который будет парсить всякое бади входящие в json
Теперь если мы передадим json  наш емейл и пароль то нам прийдет
{ email: 'a@a.ru', password: 'namdasdae' } 
Наш body-parser парсит json и кладет его в req.body в нашем users.controller там где DTO
*/
