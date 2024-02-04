const fs = require('fs');

function main(passedOption) {

    // CRUD options
    var options = {
        'add': () => { add() },
        'list': () => { list() },
        'edit': () => { edit() },
        'delete': () => { deleteTodo() },
        'default': () => { console.log('Unknown Option | Only Allowed (add - edit - list - delete)'); },
    }
    try { options[passedOption](); }
    catch (err) { options['default'](); }//default behaviour
}


// Driver Function
main(process.argv[2]);


/**
 * Deletes todo by id
 */
function deleteTodo() { // delete is reserved as keyword in VS code

    if (checkFile() && process.argv[3]) {
        var todos = checkFile();
        var targetTodo = todos.find((todo) => todo.id === parseInt(process.argv[3]));

        if (typeof targetTodo !== "undefined") {

            // Re-assigns only todos excluding the target one (delete mechanism).
            todos = todos.filter((todo) => todo.id !== parseInt(process.argv[3]));
            fs.writeFile('./todos.json', JSON.stringify(todos), () => {});

        } else {
            console.warn("404 - Not Found!");
        }
    }else{
        console.error("Check your id input")
    }

}


/**
 * Edits todo by id
 */
function edit() {

    if (checkFile() && process.argv[3]) {
        var todos = checkFile();

        // We should parse to int as arguments are string by default.
        var updatedTodo = todos.find((todo) => todo.id === parseInt(process.argv[3]));

        // Assure that this todo is already there.
        if (typeof updatedTodo !== "undefined" && process.argv[4]) {

            updatedTodo.title = process.argv[4];

            for (var todo of todos) {
                if (todo.id === parseInt(process.argv[3]))
                    todo = updatedTodo;
            }

            fs.writeFile('./todos.json', JSON.stringify(todos), () => {});

        } else {
            console.warn("Check your input!");
        }
    } else {
        console.warn("Check your id input");
    }

}


/**
 * Diplays all todos after checking the file as well
 */
function list() {
    if (checkFile()) {
        var todos = checkFile();
        console.log(todos);
    }
}


/**
 * Adds (appends) a new todo to the list as (object)
 */
function add() {

    // Validate file existence and title is passed to CLI command.
    if (checkFile() && process.argv[3]) {
    
        var todos = checkFile();
        const todo = {
            // Get id of last-indexed todo object or it's the first one
            id: (todos.length > 0) ? todos[todos.length - 1].id + 1 : 1,
            title: process.argv[3],
            status: "to-do"
        };

        todos.push(todo);
        fs.writeFile('./todos.json', JSON.stringify(todos), () => {});  // stringify when write
    }
}


/**
 * Check if file exists, then return todos 
 * or not then, write an empty array to it.
 * @returns todos
 */
function checkFile() {
    try {
        const todosJSON = fs.readFileSync('./todos.json', 'utf-8');
        return JSON.parse(todosJSON);   //  parse when read.
    } catch (error) {
        fs.writeFile('./todos.json', JSON.stringify([]), () => {});
        console.error("Error"); //Todos aren't there, choose [add] with a [title]");
    }
}