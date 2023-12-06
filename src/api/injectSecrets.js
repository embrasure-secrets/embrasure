// import spawn method of node:child_process module
import { spawn } from 'child_process';
import { getAllSecrets } from './api.js';

const NODE_PATH = process.execPath;
const REDACTION = '--SECRET REDACTED BY EMBRASURE--';

async function injectSecrets(FILE_NAME, env) {
    const secrets = await getAllSecrets();
    const secretValues = secrets.map(({ value }) => value);
    const child = spawn(NODE_PATH, [FILE_NAME], {
        env,
    });

    const handleStdout = (data) => {
        let dataString = String(data);
        secretValues.forEach((secretValue) => {
            dataString = dataString.replace(secretValue, REDACTION);
        });

        process.stdout.write('Child Process Output:\n');
        process.stdout.write(`${dataString}\n`);
    };

    const handleStderr = (data) => {
        let dataString = String(data);
        secretValues.forEach((secretValue) => {
            dataString = dataString.replace(secretValue, REDACTION);
        });

        process.stderr.write('Child Process Error:\n');
        process.stderr.write(`${dataString}\n`);
    };

    // log child process output
    child.stdout.on('data', handleStdout);

    // log child process errors
    child.stderr.on('data', handleStderr);

    child.on('close', (code) => {
        console.log(`Child Process exited with code ${code}`);
    });
}

export default injectSecrets;
