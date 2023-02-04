import { UserModel } from '@prisma/client';
import { User } from './user.entity';

export interface IUsersRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}

// Наш метод create будет принимать на вход юзера, а возвращать промис(так как он асинхронный) ЮзерМодел из Призмы
