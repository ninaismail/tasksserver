const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
var cors = require("cors");

const app = express()
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json())
// enable cors
app.use(cors())
// MySQL
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'tasksdatabase'
})
   
// Get all tasks
app.get('/tasks', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from tasks', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from tasks table are: \n', rows)
        })
    })
})

// Get a task
app.get('/tasks/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM tasks WHERE id = ?', [req.body.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from task table are: \n', rows)
        })
    })
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`Task with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from task table are: \n', rows)
        })
    })
});

// Add a task
app.post('/tasks', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err

        const inputtitle = req.body.title;
        connection.query('INSERT INTO tasks (title) VALUES ("?")', [inputtitle], (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`Task with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from tasks table are:11 \n', rows)

        })
    })
});

// update a task
app.put('/tasks/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const inputtitle = req.body.title
        connection.query('UPDATE tasks SET title = ? WHERE id = ?', [inputtitle, req.params.id] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`Task with the id: ${req.params.id} has been updated.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})


// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))