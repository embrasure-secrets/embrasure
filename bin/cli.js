#!/usr/bin/env node

/*
Running each of the functions below leads to a huge wall of text being logged to the console, needs fixing.

The return values of the functions is not standardized. Some return the resource you're looking for, others return `undefined` and log something to the console. 

Need to remove side-effects, have pure functions.

Connection to DB does not exit immediately after each function is executed. There is usually a few seconds of delay.
*/

import { Command } from 'commander';

import {
    getAllSecrets,
    getAllUsers,
    getAllLogs,
    getSecret,
    deleteSecret,
    updateSecret,
    addSecret,
    addUser,
    deleteUser,
    showPermissions,
    editPermission,
} from '../src/api/api.js';

import initNewUser from '../src/aws/iam/initNewUser.js';
import deleteIAMUser from '../src/aws/iam/deleteIAMUser.js';
import init from '../src/aws/init.js';

import injectSecrets from '../src/api/injectSecrets.js';
import teardown from '../src/aws/teardown.js';

const cli = new Command();

cli.version('1.0.0').description('Welcome to Embrasure Secrets Manager');

cli.command('i')
    .alias('init')
    .requiredOption('-u --username <username>', 'Specify master username')
    .requiredOption('-p --password <password>', 'Specify master password')
    .description('Initialize backend architecture. Run this only once.')
    .action(async ({ username, password }) => {
        await init(username, password);
    });

cli.command('t')
    .alias('teardown')
    .description('Delete backend architecture.')
    .action(async () => {
        await teardown();
    });

cli.command('gas')
    .alias('getAllSecrets')
    .description('Get all secrets for your current project environment')
    .action(async () => {
        const secrets = await getAllSecrets();
        console.log(secrets);
    });

cli.command('gau')
    .alias('getAllUsers')
    .description('Get all users for your current project environment')
    .action(async () => {
        const users = await getAllUsers();
        console.log(users);
    });

cli.command('gal')
    .alias('getAllLogs')
    .description('Get all logs')
    .action(async () => {
        const logs = await getAllLogs();
        console.log(logs);
    });
cli.command('gs')
    .alias('getSecret')
    .description('Get secret with specified name for your current project   environment')
    .option('-n --name <name>', 'Specify secret name')
    .action(async ({ name }) => {
        const secret = await getSecret(name);
        console.log(secret);
    });

cli.command('as')
    .alias('addSecret')
    .description('Add secret with specified name and value')
    .option('-n --name <name>', 'Specify secret name')
    .option('-v --value <value>', 'Specify secret value')
    .action(async ({ name, value }) => {
        await addSecret(name, value);
        console.log(`"${name}" secret added.`);
    });

cli.command('us')
    .alias('updateSecret')
    .description('Update secret with specified name')
    .option('-n --name <name>', 'Specify secret name')
    .option('-v --value <value>', 'Specify secret value')
    .action(async ({ name, value }) => {
        await updateSecret(name, value);
        console.log(`"${name}" secret updated.`);
    });

cli.command('ds')
    .alias('deleteSecret')
    .description('Delete secret with specified name')
    .option('-n --name <name>', 'Specify secret name')
    .action(async ({ name }) => {
        await deleteSecret(name);
        console.log(`"${name}" secret deleted.`);
    });

cli.command('du')
    .alias('deleteUser')
    .description('Delete user with specified name')
    .option('-n --name <name>', 'Specify user name')
    .action(async ({ name }) => {
        await deleteIAMUser(name);
        await deleteUser(name);
        console.log(`"${name}" user deleted.`);
    });

cli.command('r')
    .alias('run')
    .description('Run file with secrets injected')
    .option('-f --file <file>', 'Specify file path')
    .action(async ({ file }) => {
        const secrets = await getAllSecrets();
        const env = secrets.reduce(
            (secretsObj, { key, value }) => ({ ...secretsObj, [key]: value }),
            {}
        );
        await injectSecrets(file, env);
    });

cli.command('au')
    .alias('addUser')
    .description('Add a user to your organization')
    .option('-n --name <name>', 'Specify username')
    .option('-w --writePermissions [boolean]', 'Specify write permissions', false)
    .action(async ({ name, writePermissions }) => {
        const nameLowercase = name.toLowerCase();
        try {
            await initNewUser(nameLowercase);
            await addUser(nameLowercase, writePermissions);
            console.log(`"${name}" user created.`);
        } catch (error) {
            console.error("Couldn't add new user");
        }
    });

cli.command('sp')
    .alias('showPermissions')
    .description('Show read/write permissions of a user')
    .option('-n --name <name>', 'Specify username')
    .action(async ({ name }) => {
        const nameLowercase = name.toLowerCase();
        try {
            const permissions = await showPermissions(nameLowercase);
            console.log(
                `${name} has the following permissions for the Secrets table: ${permissions}`
            );
        } catch (error) {
            console.error("Couldn't show permissions of user");
        }
    });

cli.command('ep')
    .alias('editPermission')
    .description('Edit read/write permission for a user')
    .requiredOption('-n --name <name>', 'Specify username')
    .option('-w --setWritePermission', 'Specify write permission', false)
    .action(async ({ name, setWritePermission }) => {
        const nameLowercase = name.toLowerCase();
        try {
            const editPermissionResult = await editPermission(nameLowercase, setWritePermission);
            console.log(editPermissionResult);
        } catch (error) {
            console.error("Couldn't edit user write permission");
        }
    });

cli.parse(process.argv);
