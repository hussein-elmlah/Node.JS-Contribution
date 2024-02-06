const { program } = require('commander');
const fs = require('fs');


program.version('1.5.0');

program
    .command('edit')
    .description('To edit todo title, or status by id')
    .alias('e')
    // Not working  = Bug
    .action(function(){
        edit(3, 4);
    })
    /// Working fine
    .option('-s, --status', 'To change a todo status')
    .action(function () {
        edit(4, 5);
    })

program
    .command('list')
    .description('To list all todos')
    .alias('l')
    .action(function(){
        list();
    })
    .option('-s, --status', 'To list by a specific status')
    .action(function () {
        list(process.argv[4]);
    })

program
    .command('add')
    .description('To add a new todo')
    .alias('a')
    .action(function(){
        add();
    })

program
    .command('delete')
    .description('To delete a todo by id')
    .alias('d')
    .action(function(){
        deleteTodo();
    })



program.parse(process.argv);


/**
 *  process.argv[2] = option
 *  process.argv[3] = id
 *  process.argv[4] = title 
 */

/**
 * Diplays all todos after checking the file as well
 * @param {*} statusToFilterBy 
 */
function list(statusToFilterBy){
    if (checkFile()) {
        var todos = checkFile();
        if (statusToFilterBy) {
            var filteredTodos = todos.filter((todo) => todo.status === statusToFilterBy);
            console.log(filteredTodos);
        } else {
            console.log(todos);
        }
    }
}

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
function edit(indexOfId, indexOfField) {

    if (checkFile() && process.argv[indexOfId]) {
        var todos = checkFile();

        // We should parse to int as arguments are string by default.
        var updatedTodo = todos.find((todo) => todo.id === parseInt(process.argv[indexOfId]));

        // Assure that this todo is already there.
        if (typeof updatedTodo !== "undefined" && process.argv[indexOfField]) {

            if (indexOfId === 3 && indexOfField === 4) {
                updatedTodo.title = process.argv[indexOfField];
            }else{
                updatedTodo.status = process.argv[indexOfField];
            }

            for (var todo of todos) {
                if (todo.id === parseInt(process.argv[indexOfId]))
                    todo = updatedTodo;
            }

            // writeFile needs callback as a second argument as it returns ...
            // but writeFileSync doesn't as it does not return ....
            fs.writeFile('./todos.json', JSON.stringify(todos), () => {});

        } else {
            console.warn("Check your input!");
        }
    } else {
        console.warn("Check your id input");
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
    }else{
        console.error("Check your input");
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