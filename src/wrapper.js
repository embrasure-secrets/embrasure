// import spawn method of node:child_process module
import { spawn } from 'child_process';

const args = process.argv;
// get node's absolute path
const NODE = args[0];

// get current directory's absolute path
const CURRENT_DIRECTORY = process.cwd();

// get filename passed in as argument. assume thats it is the argument
const FILE_NAME = `${CURRENT_DIRECTORY}/${args[3]}`;

const env = { PORT: 3000 };
const child = spawn(NODE, [FILE_NAME], { env });

// log child process output
child.stdout.on('data', (data) => {
    console.log(`Child Process Output: ${data}`);
});

// log child process errors
child.stderr.on('data', (data) => {
    console.error(`Child Process Error: ${data}`);
});

child.on('close', (code) => {
    console.log(`Child Process exited with code ${code}`);
});
