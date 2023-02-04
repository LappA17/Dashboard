import { UserModel } from '@prisma/client';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}
/*
createUser: (dto: UserRegisterDto) => User; вот здесь мы можем уже взаимодейстсвовать исключительно уже с dto, то-есть до попадания в Сервис мы работает с DTO, соотвественно мы можем UserRegisterDto использовать, а возвращать будет новосозданного пользователя User либо налл если не удалось создать юзера к примеру из-за того что такой юзер уже есть
validateUser - будет валидировать пользователя
*/
