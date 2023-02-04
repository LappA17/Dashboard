import 'reflect-metadata'

function Test(target: Function) {
	Reflect.defineMetadata('a', 1, target)
	const meta = Reflect.getMetadata('a', target) // указываем какой ключ мы хотим получить и из какой цели
	console.log(meta)
}

function Prop(target: Object, name: string) {}

function Injectable(key: string) {
	return (target: Function) => {
		Reflect.defineMetadata(key, 1, target)
		const meta = Reflect.getMetadata(key, target)
		console.log(meta)
	}
}

//@Test
@Injectable('C')
class C {
	@Prop prop: number
}

@Injectable('D')
class D {
	// Когда мы видим Injet для C то мы понимаем что вот сюда нам нужно подставить инстенс С который сформировали благодаря @Injectable('C')
	// По сути когда мы оборачиваем класс в @Injectable, мы можем в нашей библиотеки инстенцеировать класс С
	// потом найти места где мы делаем инжект этого С по-этому же ключу и туда его пропихнуть
	constructor(@Inject('C') c: C) {}
}

/*
Reflect.defineMetadata - принимает три параметра, ключ с которым мы хотим задефайнить, значение которое мы хотим передать и сохранить и цель на которую мы будем тригирится для сохранения  */
