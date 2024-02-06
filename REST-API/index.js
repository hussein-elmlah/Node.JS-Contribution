const fs = require('fs');
const express = require('express');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// set ejs as the view engine
app.set('view engine', 'ejs')

app.use('/styles', express.static('styles'));

function getData() {
    var todosData = '';
    fs.readFile('todos.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }else{
            todosData = data;
        }
    })
    return JSON.parse(todosData);
}

// getData()

app.get('/todos', (req, res) => {

    fs.readFile('todos.json', 'utf8', (err, data) => {
        try {
            const todosData = JSON.parse(data);
            // res.json(todosData);
            res.render('index', {data: todosData})
        } catch (error) {
            console.error("error")
            res.status('500').send('err');
        }
    });

});

app.get('/todos/:id', (req, res) => {
    fs.readFile('todos.json', 'utf8', (err, data) => {
        try {
            const todosData = JSON.parse(data);
            const target = todosData.find(t => t.id === parseInt(req.params.id))
            res.send(target);
        } catch (error) {
            res.status('500').send('err');
        }
    });
});

app.post('/todos', (req, res) => {

    fs.readFile('todos.json', 'utf8', (err, data) => {
        try {
            const todosData = JSON.parse(data);
            
            const newTodo = {
                id: (todosData.length > 0) ? todosData[todosData.length - 1].id + 1 : 1,
                title: req.body.title,
                status: req.body.status ?? 'to-do'
            }

            todosData.push(newTodo);

            fs.writeFileSync('./todos.json', JSON.stringify(todosData, null, 2))
            res.send(newTodo);
        } catch (error) {
            res.status('500').send(`error: ${err}`);
        }
    });
});

app.delete('/todos/:id', (req, res) => {

    fs.readFile('todos.json', 'utf8', (err, data) => {
        try {
            let todosData = JSON.parse(data);
            todosData    = todosData.filter(t => t.id !== parseInt(req.params.id))            

            fs.writeFileSync('./todos.json', JSON.stringify(todosData, null, 2))
            res.send('deleted');
        } catch (error) {
            res.status('500').send(`error: ${err}`);
        }
    });
});

app.patch('/todos/:id', (req, res) => {

    fs.readFile('todos.json', 'utf8', (err, data) => {
        try {
            const todosData = JSON.parse(data);
            const target    = todosData.find(t => t.id === parseInt(req.params.id))

            target.id = (req.body.id) ?? target.id
            target.title = (req.body.title) ?? target.title
            target.status = (req.body.status) ?? target.status

            fs.writeFileSync('./todos.json', JSON.stringify(todosData, null, 2))
            res.send(target);
        } catch (error) {
            res.status('500').send(`error: ${err}`);
        }
    });
});


app.listen(3000)