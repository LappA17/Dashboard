import express from 'express';
import { userRouter } from './users/users.js';
const port = 8000;
const app = express();
userRouter.use((req, res, next) => {
    console.log('Обработчик роута ', Date.now());
    next();
});
app.use((req, res, next) => {
    console.log('Время ', Date.now());
    next();
});
app.get('/hello', (req, res) => {
    res.end();
});
app.use('/users', userRouter);
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).send(err.message);
});
app.listen(port, () => console.log(`Server started on: ${port}`));
