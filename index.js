const fs = require('fs');


try {
    
    const todosJSON = fs.readFileSync('./todos.json', 'utf-8');
    let todos       = JSON.parse(todosJSON);

    switch (process.argv[2]) {

        //------------------------------------------------------------------------------------------
        case 'add':

        if (process.argv[3]) {

            const newTodo = {
                id: todos[todos.length - 1].id+1,
                title: process.argv[3],
                status: "to-do"
            }

            todos.push(newTodo);
            
            fs.writeFile('./todos.json', JSON.stringify(todos),  (err) => console.log(err));
            
        }else{
            console.log('no');
        }

            break;

        //------------------------------------------------------------------------------------------
        case 'edit':

            var updatedTodo = todos.find((todo) => todo.id === parseInt(process.argv[3]));

            if (typeof updatedTodo !== "undefined" && process.argv[4]) {

                updatedTodo.title = process.argv[4];

                for (var todo of todos) 
                {
                    if (todo.id === parseInt(process.argv[3]))
                        todo = updatedTodo;
                }

                fs.writeFile('./todos.json', JSON.stringify(todos),  (err) => console.log(err));

            }else{
                console.warn("Not Found 404");
            }

            break;

        //------------------------------------------------------------------------------------------
        case 'list':

            console.log(todos);
            break;
    
        //------------------------------------------------------------------------------------------
        case 'delete':
            
           var targetTodo = todos.find((todo) => todo.id === parseInt(process.argv[3]));

           if (typeof targetTodo !== "undefined" && process.argv[3]) {

               todos = todos.filter((todo) => todo.id !== parseInt(process.argv[3]));
               fs.writeFile('./todos.json', JSON.stringify(todos),  (err) => console.log(err));

            }else{
                console.warn("Not Found 404");
            }

            break;

        //------------------------------------------------------------------------------------------
        default:
            break;
    }
    return;

    
} catch (error) {
    console.log("err no file")

    if(! process.argv[2])
    {
        console.error("you should pass an option")
    }else if (process.argv[2] === 'add' && process.argv[3]){

        const firstTodo = [{
            id: 1,
            title: process.argv[3],
            status: "to-do"
        }]
    
        fs.writeFile('./todos.json', JSON.stringify(firstTodo),  () => {
                console.log("added firstly");
                return
            }
        );

    }else{
        console.error('invlaid');
    }

}

