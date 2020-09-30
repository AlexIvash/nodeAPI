const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'todo'
});

try {
connection.connect();
} catch(e) {
console.log('Oops.Connection to MySql failed.');
console.log(e);
}

//console.log(connection); эта команда просто выдает данные о соединении и все с базой данных в консоль

/*my
API по какой-то причине не работает с этим mysql. Думаю не все данные введены правильно. Убрать комментирование когда решу вопрос с sql.



ЗАПУСКАТЬ АПИ КОМАНДОЙ node ./src/index.js
*/


/*
api.use((req, res, next) => {
console.log("Hello");
next();
эта функция будет выводить сообщение в консоль каждый раз, когда я открою браузер
с url localhost:3000

Эта технология использует обычный express.app + websocket io для обмена сообщениями
})*/
const api = express();
api.use(express.static(__dirname + '/public'));
api.use(bodyParser.json());
/*это функция указывающая на папку где лежит index.html и другие js файлы
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

api.get('/tasks', (req, res) => {
/*Здесь у нас указана стрелочная функция. Что говорит о том, что если пользователь заходит на эту страницу
  то выполняется стрелочная функция в которой выполняется соединение с базой данных
  и вывод всех данных.
  Эта функция содержит константу connection которая коннектится к базе данных и после этого
  выполняет запрос вывода на экран всего что есть в БД*/
    connection.query('SELECT * FROM tasks ORDER BY created DESC', (error, results) => {

        if (error) return res.json({error: error});
        res.json(results
            /*{
            todo: results.filter(item => !item.completed),
            completed: results.filter(item => item.completed)
        }*/
        );
    });
});



api.post('/tasks/add', (req, res)=>{
console.log(req.body);
//res.send('It works!'); мы закоментируем это чтобы написать другой код который позволит нам записывать
//это изменение сразу в базу данных

    //Здесь мы при отправке post запроса на /tasks/add вызываем функцию соединения с базой данных
connection.query('INSERT INTO tasks (description) VALUES (?)', [req.body.item], (error, results)=>{
    if (error) return res.json({error: error});

    connection.query ('SELECT LAST_INSERT_ID() FROM tasks', (error, results) => {
        if (error) return res.json({error: error});



        res.json({

                id: results[0]['LAST_INSERT_ID()'],
                description: req.body.item
            });
    });
});
});

api.post('/tasks/:id/update', (req,res) => {
//console.log(req.body);
    //мы отправляем patch запрос на базу данных при переводе на tasks/:id/update
    connection.query('UPDATE tasks SET completed = ? WHERE id = ?', [req.body.completed, req.params.id], (error, results) =>{
        if (error) return res.json({error: error});

        res.json({});
    });
});

api.post('/tasks/:id/remove', (req, res) => {

    connection.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (error,results) =>{
        if (error) return res.json({error: error});

        res.json({});
    });
});