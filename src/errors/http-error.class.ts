export class HTTPError extends Error {
	statusCode: number;
	context?: string;

	constructor(statusCode: number, message: string, context?: string) {
		super(message);
		this.statusCode = statusCode;
		this.message = message; // message уже есть в Error, его не нужно повторно объявлять
		this.context = context;
	}
}

/*
Здесь мы будем брать исходный класс ошибки в ТС и его экстендим 
Создав этот класс мы получим все возможности класса Еррор и дополним его статус-кодом ! */
