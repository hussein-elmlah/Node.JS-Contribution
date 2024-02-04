const fs = require('fs');

function main(what) {
    var options = {
        'add': () => { add() },
        'list': () => { list() },
        'edit': () => { edit() },
        'delete': () => { deleteTodo() },
        'default': () => { console.log('This is the default behaviour'); },
    }
    try { options[what](); }
    catch (err) { options['default'](); }//default behaviour
}



main(process.argv[2]);


function deleteTodo() { // delete is reserved in as keyword in VS code

    if (checkFile() && process.argv[3]) {
        var todos = checkFile();
        var targetTodo = todos.find((todo) => todo.id === parseInt(process.argv[3]));

        if (typeof targetTodo !== "undefined") {

            todos = todos.filter((todo) => todo.id !== parseInt(process.argv[3]));
            fs.writeFile('./todos.json', JSON.stringify(todos), () => {});

        } else {
            console.warn("404 - Not Found!");
        }
    }else{
        console.error("Check your id input")
    }

}

function edit() {

    if (checkFile() && process.argv[3]) {
        var todos = checkFile();
        var updatedTodo = todos.find((todo) => todo.id === parseInt(process.argv[3]));

        if (typeof updatedTodo !== "undefined" && process.argv[4]) {

            updatedTodo.title = process.argv[4];

            for (var todo of todos) {
                if (todo.id === parseInt(process.argv[3]))
                    todo = updatedTodo;
            }

            fs.writeFile('./todos.json', JSON.stringify(todos), () => { });

        } else {
            console.warn("404 - Not found!");
        }
    } else {
        console.warn("Check your id input");
    }

}
function list() {
    if (checkFile()) {
        var todos = checkFile();
        console.log(todos);
    }
}
function add() {
    if (checkFile() && process.argv[3]) {

        var todos = checkFile();

        const todo = {
            id: (todos.length > 0) ? todos[todos.length - 1].id + 1 : 1,
            title: process.argv[3],
            status: "to-do"
        };

        todos.push(todo);
        console.log(todos);

        fs.writeFile('./todos.json', JSON.stringify(todos), () => { });  // stringify when write

    }
}

function checkFile() {
    try {
        const todosJSON = fs.readFileSync('./todos.json', 'utf-8');
        return JSON.parse(todosJSON);   //  parse when read.
    } catch (error) {
        fs.writeFile('./todos.json', JSON.stringify([]), () => { });

        console.error("Error"); //Todos aren't there, choose [add] with a [title]");
    }
}