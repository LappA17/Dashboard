import { injectable } from 'inversify';
import { Logger } from 'tslog';
import { ILogger } from './logger.interface';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
	public logger: Logger;

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		// отправка в sentry / rollbar
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}

/*
export class LoggerService {
    private static logger: Logger

    static log(...args: unknown[]) {
        LoggerService.logger.info(...args)
    }

    static error(...args: unknown[]) {
        LoggerService.logger.error(...args)
    }

    static warn(...args: unknown[]) {
        LoggerService.logger.warn(...args)
    }
}
Мы бы могли написать такой код, потом в app.ts уже импортировать ЛоггерСервис и вместо консоль лога `Сервер запущен на порту ${this.port}` уже напишем нормальное логгирование LoggerService.log(`Сервер запущен на порту ${this.port}`
Но когда мы так делаем то мы явно импортируем одну зависимоть в другую, мы уже не можем разделить наше приложение, к примеру взять и подменить логгер на новый, потому что это обычный импорт и мы связываем эти два блока. Мы не можем отделать, тестировать, что-то с этим делать
import { LoggerService } from './logger/logger.service'
Что бы решить эту проблему мы создаем заново конструктор у логгера
public logger: Logger

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		})
	}

	log(...args: unknown[]) {
		this.logger.info(...args)
	}

	error(...args: unknown[]) {
		this.logger.error(...args)
	}

	warn(...args: unknown[]) {
		this.logger.warn(...args)
	}
Дальше в app.ts мы уже создаем инстенс этого Логгера ! this.logger = new LoggerService()
this.logger.log(`Сервер запущен на порту ${this.port}`)

Но проблему это особо не решает, да мы используем новый инстенс, но мы всё равно завязаны на том что мы всегда используем один и тот LoggerService !
Что бы решить эту проблему - нам необходимо передавать наш Логгер в конструктор !
То-есть в app.ts передаем в constructor(logger: LoggerService), а логгер уже this.logger = logger
И уже в папке main.ts в const app = new App(new LoggerService())

Это называется Депенденси Инжекшен, мы внедряем в App через конструктор зависимость от другого Сервиса

//
@injectable() - это декоратор, который говорит что тот класс который мы задекорировали можно положить в контейнер

*/
