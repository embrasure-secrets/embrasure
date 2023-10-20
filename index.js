import getAllSecrets from './src/utils/rds/getAllSecrets.js';
import injectSecrets from './src/wrapper.js';

const args = process.argv;
// get node's absolute path
const NODE = args[0];

// get current directory's absolute path
const CURRENT_DIRECTORY = process.cwd();

// get filename passed in as argument. assume thats it is the argument
const FILE_NAME = `${CURRENT_DIRECTORY}/${args[3]}`;

console.log(FILE_NAME);
// getAllSecrets returns array of secrets objects
// Secret Object:
// {
//   id: 1,
//   key: 'secretkey',
//   value: 'asdfasdfasdf',
//   createdAt: 2023-10-20T16:18:10.993Z,
//   updatedAt: 2023-10-20T16:18:10.993Z
// }

const secretsData = await getAllSecrets();
const env = {};
secretsData.forEach(({ key, value }) => {
    env[key] = value;
});

// console.log(env);

// node index.js -- test.js
injectSecrets(NODE, FILE_NAME, env);
