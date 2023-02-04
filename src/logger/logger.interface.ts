import { Logger } from 'tslog';

export interface ILogger {
	logger: unknown;
	log: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
}

/*Этот ЛоггерИнтерфейс - будет фактически неким контрактом и мы сказали что логгер который мы используем в системе должен удолитворять след интерфейсу ILogger
А наш class LoggerService implements ILogger - это конкретная имплементация нашего интерфейса логгера, с конкретным созданим этого логгера, с логом еррора, варна и тд 
Теперь в App.ts мы идем в конструктор constructor( logger: LoggerService, 
И здесь заменяем LoggerService уже на наш ILogger тем самым мы уже не зависим конкретно от LoggerService
Если мы перейдем в main и наведем мышкой на new App то мы увидим что туда нужно передать Логгер, но это уже будет не LoggerService, а какой-то ILogger который определяет конкретный набор свойств и методов
За счет такого разделеня мы получаем DI со связью через интерфейс
*/
