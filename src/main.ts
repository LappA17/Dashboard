import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { ExeptionFilter } from './errors/exeption.filter';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import { IUserController } from './users/users.controller.interface';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/users.repository.interface';
import { UserService } from './users/users.service';
import { IUserService } from './users/users.service.interface';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
/*
/* const logger = new LoggerService()
	const app = new App(logger, new UserController(logger), new ExeptionFilter(logger))
	await app.init() *

appContainer.bind<ILogger> - байнд это фция которая принимает дженерик и во внутрь мы указываем фцию которую мы будем байндить, к примеру ILogger 
appContainer.bind<ILogger>().to(LoggerService) - биндим на ЛоггерСервис - кокретную реализацию нашего Логгера
а во внутрь bind() передаём символ связи TYPES.ILogger что бы по нему inversify js смог его связать

Плюс такого подхода что мы можем в любой момент получить инстенс Объекта через get, если у нас будет добавляться injectable то везде в тех местах нам не нужно будет прокидывать их в ручную, мы один раз делаем бинд контейнера и в том месте где нужно подставить наш Объект мы пишем 
@inject(TYPES.ILogger) private logger: ILogger и передаем нужный нам Класс

//
Представим что вот эти биндинги appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService) будут разростаться и их будет уже не 4 а к примеру 30. Для этого у библиотеки inversify есть КонтейнерМодули

После того как мы сделали КонтейнерМодули appContainer.load(appBindings)

//inSingletonScope
Мы уже наверняка всё обернули в синглтон, хотя понятно что там где один импорт, то это в целом вообще никак не кртично

//
сделаем нашу фцию bootstrap async, а перед app.init() поставим await тем самым мы точно будем знать что когда мы дойдём до ретёрна то у нас все точно будет окей
export const { app, appContainer } = bootstrap(); теперь здесь вместо этого мы вернём просто boot, потому что это Промис от bootstrap спредить
*/
