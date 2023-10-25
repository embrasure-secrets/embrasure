import getAllSecrets from '../src/utils/rds/getAllSecrets.js';
import Secrets from '../src/utils/rds/model.js';

jest.mock('../src/utils/rds/model.js', () => {
    return {
        findAll: jest.fn(),
    };
});

describe('getAllSecrets', () => {
    it('should get all secrets and return an array with formatted results', async () => {
        const mockSecretsData = [
            { dataValues: { key: 'exampleKey1', value: 'exampleValue1' } },
            { dataValues: { key: 'exampleKey2', value: 'exampleValue2' } },
        ];

        Secrets.findAll.mockResolvedValue(mockSecretsData);
        const result = await getAllSecrets();

        expect(result).toEqual([
            { key: 'exampleKey1', value: 'exampleValue1' },
            { key: 'exampleKey2', value: 'exampleValue2' },
        ]);
    });
    it('should handle errors when getting secrets', async () => {
        const error = jest.spyOn(console, 'error').mockImplementation(() => {});
        const expectedError = new Error("Couldn't get all secrets");

        Secrets.findAll.mockRejectedValue(expectedError);
        const result = await getAllSecrets();

        expect(result).toBeUndefined();
        expect(error).toHaveBeenCalledWith('Error getting all secrets: ', expectedError);
    });
});
