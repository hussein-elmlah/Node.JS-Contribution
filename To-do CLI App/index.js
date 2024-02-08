const { program } = require('commander');
const fs = require('fs');
const { title } = require('process');


program.version('1.5.0');

program
    .command('edit <id>')
    .description('To edit todo title, or status by id')
    .alias('e')
    // Not working  = Bug
    .option('-t, --title <string>', 'to change a todo title')
    .option('-s, --status <string>', 'To change a todo status')
    .action((id, options)=>{
        edit(id, options);
    })
    /// Working fine


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
 function edit(id, options) {
    let todos = checkFile();
    let taskToEdit = todos.find((task) => task.id === Number(id));

    if (!taskToEdit) {
      console.error(`No task found with ID ${id}`);
      return;
    }
  
    if (!options.title && !options.status) {
      console.error('Specify -t or -s or both to update the task.');
      return;
    }
  
    if (options.title) {
      taskToEdit.title = options.title;
      console.log(`To-do task with ID ${id} edited: ${taskToEdit.title}`);
    }
  
    if (options.status) {
      if (['to-do', 'in-progress', 'done'].includes(options.status)) {
        taskToEdit.status = options.status;
        console.log(`To-do task with ID ${id} marked as '${taskToEdit.status}'`);
      } else {
        console.error('Invalid status. Allowed values: to-do, in-progress, done.');
        return;
      }
    }

    fs.writeFile('./todos.json', JSON.stringify(todos), () => {});
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