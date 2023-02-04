/*
Декораторы - позволяют делать метапрограммирование
Виды декоратора: 
    - Декоратор класса
    - Декоратор свойства
    - Декоратор метода 
    - Декоратор параметра
    
@Component
class User {
    @Prop
    myName: string

    @Method
    setName(@Param name:string) {
        this.myName = name
    }
}
Порядок исполнения сверху-вниз, если мы над @Component повесим @Logger то он отработает

По сути декоратор это просто фция
*/

/* function Component(target: Function) {
    //console.log(target) // [class User] даже если мы нигде не сделаем в коде инстенс нашего класса
    
} */

function Component(id: number) {
	console.log('init coponent');
	return (target: Function) => {
		console.log('run coponent');
		target.prototype.id = id; //так мы можем достучать до айдишника нашего class User
	};
}

function Logger() {
	console.log('init logger');
	return (target: Function) => {
		console.log('run logger');
	};
}

function Method(target: Object, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
	console.log(propertyKey);
	//если мы пропишем propertyDescriptor. то у нас появятся его методы, к примеру get, set, value и тд
	//если мы изменим value то мы тем самым изменим метод который ме декорируем
	const oldValue = propertyDescriptor.value; //хорошей практикой является записывать старое значение в переменную
	propertyDescriptor.value = function (...args: any[]) {
		return args[0] * 10; //мы наш айдишник умножим на 10
	};
}

function Prop(target: Object, propertyKey: string) {
	let value: number;

	const getter = () => {
		console.log('get');

		return value;
	};

	const setter = (newValue: number) => {
		console.log('set');
		value = newValue;
	};

	Object.defineProperty(target, propertyKey, {
		// мы фактически переопределяем геттер и сеттер для value нашего id(оно в качестве value)
		get: getter,
		set: setter,
	});
}

function Param(target: Object, propertyKey: string, index: number) {
	// propertyKey  будет сам метод updateId
	console.log(propertyKey, index); // index будет 0, то-есть Param будет декоратором для параметра переданного для updateId нулевого индекса
}

@Logger()
@Component(1)
class User {
	@Prop id: number;

	@Method
	updateId(@Param newId: number) {
		this.id = newId;
		return this.id;
	}
}

console.log(new User().id); // из-за того что мы здесь arget.prototype.id = id поменяли айди у нашего класса, то мы получим id: 1
console.log(new User().updateId(2)); // вернется 20

/*
После того как мы создали 
@Logger()
@Component(1)
У нас инициализация идет правильном порядке 
console.log('init coponent');
console.log('init logger');
console.log('run coponent');
console.log('run logger');
Но как мы видим запуск идет в разном порядке */
