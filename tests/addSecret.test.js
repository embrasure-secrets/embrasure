import addSecret from '../src/utils/rds/addSecret.js';
import Secrets from '../src/utils/rds/model.js';

jest.mock('../src/utils/rds/model.js', () => {
    return {
        create: jest.fn(),
    };
});

describe('addSecret', () => {
    it('should add a secret and return the formatted result', async () => {
        const mockSecretData = { dataValues: { key: 'exampleKey1', value: 'exampleValue1' } };

        Secrets.create.mockResolvedValue(mockSecretData);

        const result = await addSecret('exampleKey1', 'exampleValue1');

        expect(result).toEqual({ key: 'exampleKey1', value: 'exampleValue1' });
    });

    it('should handle errors when adding a secret', async () => {
        const error = jest.spyOn(console, 'error').mockImplementation(() => {});
        const expectedError = new Error("Couldn't access database");

        Secrets.create.mockRejectedValue(expectedError);

        const result = await addSecret('exampleKey2', 'exampleKey2');

        expect(result).toBeUndefined();
        expect(error).toHaveBeenCalledWith('Error in creating a new record: ', expectedError);
    });
});
