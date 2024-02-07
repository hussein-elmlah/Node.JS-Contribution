const fs = require('fs');

function read(req, res) {
    fs.readFile('todos.json', 'utf8', (err, data) => {
        try {
            let todosData = JSON.parse(data);
            // res.json(todosData);
            const statusNeedle = req.query.status
            todosData = (statusNeedle) ? todosData.filter(t => t.status === statusNeedle) : todosData;
            res.render('index', { data: todosData })
        } catch (error) {
            console.error("error")
            res.status('500').send('Internal Server Error');
        }
    });
}


module.exports = read