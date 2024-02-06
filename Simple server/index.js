const fs = require('fs');
const server = require('http');

// change this scope
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

// res.end() position is very important

// initiate a server
server.createServer(function (req, res) {

    if (req.url === '/') {
        // convert from string to Json
        var newData = JSON.parse(todosData);

        // delete id for each todo element
        for (var todo of newData) {
            delete todo.id;
        }

        // convert back again to string with pretty presentation
        const FinalData = JSON.stringify(newData, null, "\t")
        res.write(FinalData);
        res.end();

    }else if (req.url === '/astronomy') {

        fs.readFile('image.jpg', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type' : 'text/plain'});
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, {'Content-Type' : 'image/jpeg'})
                res.end(data)
            }
        });

    } else {

        res.write('<html>');
        res.write('<head><title>No</title></head>')
        res.write('<body> 404 </body>')
        res.write('</html');
        res.end();
    }

    // write to the response
}).listen(3000, () => console.log('listening ...'));


