const fs = require('fs');

function readTodo(req, res) {
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
}

module.exports = readTodo;
