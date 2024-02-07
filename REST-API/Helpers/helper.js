const fs = require('fs');

function helper(req, res, callback) {

    fs.readFile('todos.json', 'utf8', (err, data) => {
        try {
            const todosData = JSON.parse(data);
            const target = todosData.find(t => t.id === parseInt(req.params.id))

            callback(target, todosData);

        } catch (error) {
            res.status('404').send('error 404 - not found');
        }
    });

}

module.exports = helper;