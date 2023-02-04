// ТАК КАК МЫ СОЗДАЛИ users.controller.ts НАМ ЭТОТ ФАЙЛ users.ts БОЛЬШЕ НЕ НУЖЕН

import express from 'express';

const userRouter = express.Router();

userRouter.post('/login', (req, res) => {
	res.send('login');
});
userRouter.post('/register', (req, res) => {
	res.send('register');
});

export { userRouter };

/*
const userRouter = express.Router() в результате мы здесь получает Роутер, куда мы можем привязывать все наши обработчика как промежуточное обработчики мидлвееры, так и обработчики get, post и прочьих запросов

Мы создали два пост запроса для логирование и регистрации на разных path
Теперь мы можем привязать этот роутер к нашему корневому приложению экспортируя роутер */
