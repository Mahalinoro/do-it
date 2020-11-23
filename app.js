const express = require('express');
const mysql = require('mysql');
require('dotenv').config();

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'doit'
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
  

app.listen(3000);