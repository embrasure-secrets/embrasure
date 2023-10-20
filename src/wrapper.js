// import spawn method of node:child_process module
import { spawn } from 'child_process';

function injectSecrets(NODE, FILE_NAME, env) {
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
}

export default injectSecrets;
