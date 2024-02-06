const fs = require('fs');
const express = require('express');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// set ejs as the view engine
app.set('view engine', 'ejs')

// prepare styles directory for serving static files
app.use('/styles', express.static('styles'));

// serve images
app.use(express.static('public'));

// image
app.get('/image', (req, res) => {
    res.render('image', { text: "This is beautiful in fayoum." });
})

// Create a new resource + Validation -> [title {string - minimum:10}, status {string}]
app.post('/todos', (req, res) => {

    // error as res() will conclude that it's a status code causing ERR_HTTP_INVALID_STATUS_CODE.
    // res.status(500).send(req.body.title.length.stringify)
    const [title, status = "to-do"] = [req.body.title, req.body.status];
    // const titleLength     = title.length + ""   // cast to string

    fs.readFile('todos.json', 'utf8', (err, data) => {
        try {
            const todosData = JSON.parse(data);

            // Enhance this part to be more clean start with negation in one line, then ...
            if (typeof title !== 'string' || title.length < 10) {
                res.send('Error, Check your input...').status('403')
            } else {

                const newTodo = {
                    id: (todosData.length > 0) ? todosData[todosData.length - 1].id + 1 : 1,
                    title: req.body.title,
                    status: status
                }

                todosData.push(newTodo);

                fs.writeFileSync('./todos.json', JSON.stringify(todosData, null, 2))
                res.send(newTodo);
            }

        } catch (error) {
            res.status('404').send(`error: Not found`);
        }
    });
});


// Root | Home | Main
app.get('/todos', (req, res) => {

    fs.readFile('todos.json', 'utf8', (err, data) => {
        try {
            const todosData = JSON.parse(data);
            // res.json(todosData);
            res.render('index', { data: todosData })
        } catch (error) {
            console.error("error")
            res.status('500').send('Internal Server Error');
        }
    });

});


// Specific resource + Validation if not found
app.get('/todos/:id', (req, res) => {
    fs.readFile('todos.json', 'utf8', (err, data) => {
        try {
            const todosData = JSON.parse(data);
            const target = todosData.find(t => t.id === parseInt(req.params.id))
            if (target) res.send(target);
            else throw new Error
        } catch (error) {
            res.status('404').send(`error - 404 Not Found`);
        }
    });
});


// Update a resource + Validation if not found + Validation on input
app.patch('/todos/:id', (req, res) => {

    fs.readFile('todos.json', 'utf8', (err, data) => {
        try {
            const todosData = JSON.parse(data);
            const target = todosData.find(t => t.id === parseInt(req.params.id))

            const [title, status = target.status] = [req.body.title, req.body.status]
            const allowedStatuses = ["to-do", "done", "in-progress"];

            if (typeof title !== 'string' || !allowedStatuses.includes(status)) {
                res.status(403).send("Bad input")
            } else {

                target.id = (req.body.id) ?? target.id
                target.title = (req.body.title) ?? target.title
                target.status = (req.body.status) ?? target.status

                fs.writeFileSync('./todos.json', JSON.stringify(todosData, null, 2))
                res.send(target);
            }
        } catch (error) {
            res.status('404').send('error 404 - not found');
        }
    });
});


// Delete a resource + Validation if not found
app.delete('/todos/:id', (req, res) => {

    fs.readFile('todos.json', 'utf8', (err, data) => {

        try {
            let todosData = JSON.parse(data);
            const target = todosData.find(t => t.id === parseInt(req.params.id))
            todosData = todosData.filter(t => t.id !== parseInt(target.id))

            fs.writeFileSync('./todos.json', JSON.stringify(todosData, null, 2))
            res.send('deleted');
        } catch (error) {
            res.status('404').send(`error - 404 Not Found`);
        }

    });
});


app.listen(3000)