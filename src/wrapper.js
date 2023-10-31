// import spawn method of node:child_process module
import { spawn } from 'child_process';

const NODE_PATH = process.execPath;
function injectSecrets(FILE_NAME, env) {
    const child = spawn(NODE_PATH, [FILE_NAME], {
        env,
    });

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
}

export default injectSecrets;
