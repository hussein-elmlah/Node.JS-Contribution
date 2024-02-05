# ToDo CLI App 

### This is a simple todo command line interface (CLI) app built with nodejs

You have to run this line first
```
const { program } = require('commander');
```


Run this command to install commander package

```
npm install commander --save
```

> --save: This flag is used to update the dependencies section in your package.json file, ensuring that information about the installed package and its version is saved.

Add this version and run the following to make sure it's working fine

```
node index.js --version
```

<hr />

### Each of which to do some functionality helping your command come to the light


Add the exact command string to be added as argv[i]
```
program
    .command('add')
```

Add a description for your command
```
    .description('To add a new todo')
```

Add an alias for your command
```
.alias('a')
```

The real behind-the-scenes action/mission of the command
```
.action(function(){
        // some logic...
    })
```

<hr />
    
You should put this line at the end of the file to parse the command-line arguments and execute the appropriate commands and options.

```
program.parse(process.argv);
```