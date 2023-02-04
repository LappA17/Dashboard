import { TYPES } from './../types';
import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error(
				'[ConfigService] We can not read this file .env or it does not exist',
			);
		} else {
			this.logger.log('[ConfigService] Configuration .env is loaded !');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}

/*
    const result = config() - это будет результат парсинга

    сам DotenvConfigOutput имеет таким типы
    export interface DotenvConfigOutput {
        error?: Error;
        parsed?: DotenvParseOutput;
    }

    this.config = result.parsed as DotenvParseOutput; потому что parsed может быть андефайнд, по-этому мы его жестко кастонём к DotenvParseOutput

    Добавим к классу @injectable() и поговорим за Синглтон, когда мы в мейне делаем все эти билдинги, они на каждый сервис инстенцеируется новый, то-есть наш Логгер не один, а их может быть несколько

    Мы инжектним наш configService в user.service и в app.ts и напишем npm run dev
    2022-09-26 06:52:08.820  ERROR [ConfigService] We can not read this file .env or it does not exist 
    2022-09-26 06:52:08.822  INFO  [post] /register 
    2022-09-26 06:52:08.823  INFO  [post] /login 
    2022-09-26 06:52:08.823  ERROR [ConfigService] We can not read this file .env or it does not exist 
    2022-09-26 06:52:08.825  INFO  Сервер запущен на http://localhost:8000 

    И мы увидим что конфигСервис отработал два раза, то-есть одна и таже загрузка отработала два раза, это может быть очень опастно ! К примеру у нас может быть два разных инстенса, а мы надеемся что мы можем что-то между ними шарить.
    По-этому в данном случае injectable происходить НЕ по паттерну СинглТон, то-есть на каждую зависимость где мы говорим inject() будет инстенцеироваться наш конкретный класс который мы прибиндили
    Что бы от этого уйти нам нужно в main.ts передать inSingletonScope() - будет инстенцеироваться Синглтон этого сервиса, то-есть один раз будет создан этот класс, а потом этот инстенс класса будет передан во все остальные сервисы, контроллеры и всё что нам нужно

    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope(); благодаря этому нам сервис отработает только один раз
    сделаем тоже самое для логгера
*/
