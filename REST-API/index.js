const fs = require('fs');
const express = require('express');
const read = require('./Helpers/read');
const readTodo = require('./Helpers/readTodo');
const helper = require('./Helpers/helper');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// set ejs as the view engine
app.set('view engine', 'ejs')

// prepare styles directory for serving static files
app.use('/styles', express.static('styles'));

// serve static files (i.e. images)
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
    read(req, res)
});


// Specific resource + Validation if not found
app.get('/todos/:id', (req, res) => {
    readTodo(req, res);
});

// Update a resource + Validation if not found + Validation on input
app.patch('/todos/:id', (req, res) => {

    const patchCallback = (target, todosData) => {
        const [title, status = target.status] = [req.body.title, req.body.status]
        const allowedStatuses = ["to-do", "done", "in-progress"];

        // validation
        if (typeof title !== 'string' || !allowedStatuses.includes(status)) {
            res.status(403).send("Bad input")
        } else {

            target.id = (req.body.id) ?? target.id
            target.title = (req.body.title) ?? target.title
            target.status = (req.body.status) ?? target.status

            fs.writeFileSync('./todos.json', JSON.stringify(todosData, null, 2))
            res.send(target);
        }
    };

    // passing a reference to a function as a callback
    helper(req, res, patchCallback)

});

// Delete a resource + Validation if not found
app.delete('/todos/:id', (req, res) => {

    helper(req, res, (target, todosData) => {
        todosData = todosData.filter(t => t.id !== parseInt(target.id))
        fs.writeFileSync('./todos.json', JSON.stringify(todosData, null, 2))
        res.send('deleted');
    })

});


app.listen(3000)