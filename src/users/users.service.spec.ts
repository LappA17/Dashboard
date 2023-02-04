import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'a@a.ua',
			name: 'Антон',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'a@a.ua',
			password: '1',
		});
		expect(res).toBeTruthy();
	});

	it('validateUser wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'a@a.ua',
			password: '2',
		});
		expect(res).toBeFalsy();
	});

	it('validateUser wrong user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'a2@a.ua',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
});

/*
    Благодаря расширению spec.ts при выполнение команды с jest будет подтягивать все необходимые файлы .spec которые лежат у нас в src

    //нам нужно собрать частично наш сервис не запуская всё приложение. По-этому мы воспользуемся beforeAll()
    //beforeAll() - фция, которая будет выполнятся перед всеми тестами

    describe('User Service' - описывает что мы тестируем, в данном случае User Service

    it('createUser', () => { - отдельный тестер, который в данном случае принимает создание пользователя 

    const container = new Container(); - мы должны в Контейнере объявить все необходимые нам зависимости 
    так как в User Service присутствует configService, userRepository то нам нужно их указать как

    container.bind<IUserService>(TYPES.UserService).to(UserService);
    Но мы так же не можем взять и прибиндить юзерРепозиторий. Потому что юзерРепозиторий в свою очередь завязан на конфиг, на сервис Призма
    По-этому нам нужно замокать некоторые элементы нашего юзерСервиса, а именно конфигСервис и юзерРепозиторий

    jest.fn - это некая фция jesta с который мы потом можем мокать

    Написав ConfigServiceMock и UsersRepository мы посути создали константы у которых есть соотвествующие фции(get, find, create то-есть то что у них находится внутри)

    Теперь нам нужно взять и подменить те зависимости которые должны быть у users.service на вот эти Моки
    И здесь начинает проявлятся то что мы завязаны только на Интерфейс, а не на Реализацию, нам что бы удолитоврить userServicе нужно кто угодно кто удолитворит IConfigService ! И так же кто угодно кто удолитворяет IUsersRepository

    Так inversify может биндить не только к Классу но и к Константе !
    	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock); и так как наш этот Мок удолитворяет IConfigService он и удолитворит ConfigService

    configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
    
    Тем самым мы создали зависимости, забиндили их и потом получили

    configService.get = jest.fn().mock() - с помощью мок мы можем замокать всё что угодно, имплимитацию, возврат, reject, resolve и тд

    configService.get = jest.fn().mockReturnValueOnce('1'); - это будет равносильно метод конфигСервиса Гет() вернёт нам 1

    expect(createdUser?.id).toEqual(1); - переводится дословно что мы ожидаем что наше айди будет равно 1

    Если мы в тесте специально сделаем ошибку и скажем что expect(createdUser?.password).toEqual('1'); наш пароль должен ровнятся 1це то получим ошибку
    Expected: "1"
    Received: "$2a$04$QgEGBdCApe4NP/tFOuuwWeqlkCKUiE3.bQh7z4FC47nUoehMYu7pC"
    Ведь наш пароль захешированный никогда не будет 1
*/
