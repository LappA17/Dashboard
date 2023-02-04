import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true, //что бы видеть детальный аутпут
	preset: 'ts-jest',
};

export default config;

/* Такой конфигурации хватит с головой для юнит тестов
const config: Config.InitialOptions = {
	verbose: true, //что бы видеть детальный аутпут
	preset: 'ts-jest',
}; */
