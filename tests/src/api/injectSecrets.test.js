import injectSecrets from '../../../src/api/injectSecrets.js';
import { spawn } from 'child_process';

jest.mock('child_process', () => ({ spawn: jest.fn() }));

describe('injectSecrets', () => {
    it('should spawn a child process with the provided arguments', () => {
        const FILE_NAME = 'todos.js';
        const env = { todoSecret: 'as234qda123!' };

        const mockChildProcess = {
            stdout: { on: jest.fn() },
            stderr: { on: jest.fn() },
            on: jest.fn(),
        };

        spawn.mockReturnValue(mockChildProcess);

        injectSecrets(FILE_NAME, env);

        expect(spawn).toHaveBeenCalledWith(process.execPath, [FILE_NAME], { env });
    });

    it('should log child process output', () => {
        const FILE_NAME = 'todos.js';
        const env = { todoSecret: 'as234qda123!' };

        const mockChildProcess = {
            stdout: { on: jest.fn() },
            stderr: { on: jest.fn() },
            on: jest.fn(),
        };

        spawn.mockReturnValue(mockChildProcess);

        const logSpy = jest.spyOn(console, 'log');

        injectSecrets(FILE_NAME, env);

        const dataHandler = mockChildProcess.stdout.on.mock.calls[0][1];

        dataHandler('You have no todos!');

        expect(logSpy).toHaveBeenCalledWith('Child Process Output: You have no todos!');

        logSpy.mockRestore();
    });

    it('should log child process errors', () => {
        const FILE_NAME = 'todos.js';
        const env = { todoSecret: 'as234qda123!' };

        const mockChildProcess = {
            stdout: { on: jest.fn() },
            stderr: { on: jest.fn() },
            on: jest.fn(),
        };

        spawn.mockReturnValue(mockChildProcess);

        const errorSpy = jest.spyOn(console, 'error');

        injectSecrets(FILE_NAME, env);

        const errorHandler = mockChildProcess.stderr.on.mock.calls[0][1];

        errorHandler('Error: Could not find todos');

        expect(errorSpy).toHaveBeenCalledWith('Child Process Error: Error: Could not find todos');

        errorSpy.mockRestore();
    });

    it('should log child process errors', () => {
        const FILE_NAME = 'todos.js';
        const env = { todoSecret: 'as234qda123!' };

        const mockChildProcess = {
            stdout: { on: jest.fn() },
            stderr: { on: jest.fn() },
            on: jest.fn(),
        };

        spawn.mockReturnValue(mockChildProcess);

        injectSecrets(FILE_NAME, env);

        const logSpy = jest.spyOn(console, 'log');
        const closeHandler = mockChildProcess.on.mock.calls[0][1];

        closeHandler(0);

        expect(logSpy).toHaveBeenCalledWith('Child Process exited with code 0');
    });
});
