const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
const PORT = process.env.PORT || 3000;

const HOST = process.env.HOST
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE
});

app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM tasks',
    (error, results) => {
      res.render('index.ejs', {tasks:results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO tasks (name, date, completion) VALUES (?, ?, ?)',
    [req.body.name, req.body.date, 0],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM tasks WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {task: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE tasks SET name=?, date=? WHERE id =?',
    [req.body.name, req.body.date, req.params.id],
    (error, results) =>{
      res.redirect('/index');
    }
    );
});

app.post('/check/:id', (req, res) => {
  connection.query(
    'UPDATE tasks SET completion=? WHERE id =?',
    [1, req.params.id],
    (error, results) =>{
      res.redirect('/index');
    }
    );
});

app.post('/uncheck/:id', (req, res) => {
  connection.query(
    'UPDATE tasks SET completion=? WHERE id =?',
    [0, req.params.id],
    (error, results) =>{
      res.redirect('/index');
    }
    );
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM tasks WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
  
});
  

