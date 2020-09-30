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

const api = express();
api.use(express.static(__dirname + '/public'));
api.use(bodyParser.json());

api.listen(3000,()=> {
console.log('API up and running!');

});


api.get('/tasks', (req, res) => {

    connection.query('SELECT * FROM tasks ORDER BY created DESC', (error, results) => {

        if (error) return res.json({error: error});
        res.json(results);
    });
});



api.post('/tasks/add', (req, res)=>{
console.log(req.body);
    /**
     description - это имя столбца в базе данных в который мы вставляем значения. ? - значит в mysql2
     что туда мы подставим параметр который в нашем случае в данный момент "[req.body.item]"





     Этот запрос - двойной запрос. Здесь мы сразу вставляем значение в столбец, а потом сразу отвечаем через res.json пользователю
     в виде тех данных которые мы вставили. И отвечаем последними данными, которые последними вставлены в базу данных где "LAST_INSERT_ID"
     */

connection.query('INSERT INTO tasks (description) VALUES (?)', [req.body.item], (error, results)=>{
    if (error) return res.json({error: error});

    connection.query ('SELECT LAST_INSERT_ID() FROM tasks', (error, results) => {
        if (error) return res.json({error: error});



        res.json({

                id: results[0]['LAST_INSERT_ID()'],
                description: req.body.item
            /**
             * Здесь указано что в json формате - key description равен тому что прилетело из запроса
             */
            });
    });
});
});

api.post('/tasks/:id/update', (req,res) => {
    /**
     UPDATE tasks SET completed - значит "обнови таблицу tasks и установи в столбец completed" значение
     [req.body.completed], где id - [req.params.id]
     ? - значит в mysql2 - что туда мы подставим параметр который в нашем случае прилетел из запроса"
     */
    connection.query('UPDATE tasks SET completed = ? WHERE id = ?', [req.body.completed, req.params.id], (error, results) =>{
        if (error) return res.json({error: error});

        res.json({});
    });
});

api.post('/tasks/:id/remove', (req, res) => {
    /**
     DELETE FROM tasks WHERE id - значит "удали из таблицы tasks запись" где id - значение прилетевшее из запроса
     [req.params.id]
     ? - значит в mysql2 - что туда мы подставим параметр который в нашем случае в данный момент "[req.body.item]"
     */
    connection.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (error,results) =>{
        if (error) return res.json({error: error});

        res.json({});
    });
});