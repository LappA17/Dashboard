import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Not correct email' })
	email: string;

	@IsString({ message: 'No password specified' })
	password: string;
}
