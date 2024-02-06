const fs = require('fs');
const server = require('http');
const path = require('path');

var todosData = '';

/** -----------Todos File ----------------------- */
const readStream = fs.createReadStream('todos.json');
readStream.setEncoding('UTF8');

readStream.on('data', (chunckOfData) => {
    todosData += chunckOfData;
});

// check if there are any errors
readStream.on('error', (err) => {
    console.error(err)
})


// initiate a server
server.createServer(function (req, res) {

    const url = req.url;

    if (url === '/') {
        // convert from string to Json
        var newData = JSON.parse(todosData);

        // delete id for each todo element
        for (var todo of newData) {
            delete todo.id;
        }

        // convert back again to string with pretty presentation
        newData = JSON.stringify(newData, null, "\t")
        res.write(newData);
        res.write(imageData);

    }else if (url === '/astronomy') {

        res.write('<html>');
        res.write('<head><title>Astronomy</title></head>')
        res.write('<body> <img src="https://media.cnn.com/api/v1/images/stellar/prod/200505225212-04-fossils-and-climate-change-museum.jpg?q=x_0,y_0,h_1125,w_1999,c_fill/h_720,w_1280"> </body>')
        res.write('</html');
        return res.end();

    } else {

        res.write('<html>');
        res.write('<head><title>No</title></head>')
        res.write('<body> 404 </body>')
        res.write('</html');
    }

    // write to the response
    res.end();
}).listen(3000, () => console.log('listening ...'));


