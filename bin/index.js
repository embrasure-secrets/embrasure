#!/usr/bin/env node

/*
Running each of the functions below leads to a huge wall of text being logged to the console, needs fixing.

The return values of the functions is not standardized. Some return the resource you're looking for, others return `undefined` and log something to the console. 

Need to remove side-effects, have pure functions.

Connection to DB does not exit immediately after each function is executed. There is usually a few seconds of delay.
*/

import { Command } from 'commander';

import { getAllSecrets, getSecret, deleteSecret, updateSecret, addSecret } from '../src/api.js';

const cli = new Command();

cli.version('1.0.0').description('Welcome to Embrasure Secrets Manager');

cli.command('ga')
    .alias('getAllSecrets')
    .description('Get all secrets for your current project environment')
    .action(async () => {
        const secrets = await getAllSecrets();
        console.log(secrets);
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
    .action(({ name, value }) => {
        addSecret(name, value);
    });

cli.command('us')
    .alias('updateSecret')
    .description('Update secret with specified name')
    .option('-n --name <name>', 'Specify secret name')
    .option('-v --value <value>', 'Specify secret value')
    .action(({ name, value }) => {
        updateSecret(name, value);
    });

cli.command('ds')
    .alias('deleteSecret')
    .description('Delete secret with specified name')
    .option('-n --name <name>', 'Specify secret name')
    .action(({ name }) => {
        deleteSecret(name);
    });

cli.parse(process.argv);
