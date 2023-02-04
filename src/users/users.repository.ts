import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}

/*
Правильно давать название файлам отвечающие за БД как наш репозиторий с соотвесвием того что там будет внутри, в нашем случае это юзеры

this.prismaService.client.userModel - этот клиент - это то что мы оставили в классе призмы публично для работы, а userModel - это что содержит наша schema.prisma - то что мы там описали
У нашей модели пользователя есть метод create и туда в виде данных мы передаем нужным нам емейл, пароль и имя
*/
