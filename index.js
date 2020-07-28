const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'oleksandr.ivashchenko',
    password:'password',
    database:'todo'
});

try {
connection.connect();
} catch(e) {
console.log('Oops.Connection to MySql failed.');
console.log(e);
}

console.log(connection);

/*my
API по какой-то причине не работает с этим mysql. Думаю не все данные введены правильно. Убрать комментирование когда решу вопрос с sql.



ЗАПУСКАТЬ АПИ КОМАНДОЙ node ./src/index.jsç
*/


/*
api.use((req, res, next) => {
console.log("Hello");
next();
эта функция будет выводить сообщение в консоль каждый раз, когда я открою браузер
с url localhost:3000
})*/
const api = express();
api.use(express.static(__dirname + '/public'));
api.use(bodyParser.json());
/*это функция указывающая на папку где лежит index.html
__dirname - всегда будет указывать на текущее местоположения проекта
то есть полный путь где находится проект - но чтобы указать поверх папки проекта
необходимо добавить название public без '/'.
*/
api.listen(3000,()=> {
console.log('API up and running!');
//Здесь мы выведем сообщения в логи что порт 3000 поднят и работает.
});
/*
api.get('/', (req, res)=>{
res.send('Hello, world!');
Здесь - сообщение, которое будет послано и открыто в браузере. И вероятно с помощью
этой функции можно заставить браузер отрисовать все, что угодно. Функция работает с get методом
});
*/

api.post('/add', (req, res)=>{
console.log(req.body);
res.send('It works!');
});