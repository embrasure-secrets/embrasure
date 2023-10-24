import getSecret from '../src/utils/rds/getSecret.js';
import Secrets from '../src/utils/rds/model.js';

jest.mock('../src/utils/rds/model.js', () => {
    return {
        findOne: jest.fn(),
    };
});

describe('getSecret', () => {
    it('should get secret and return the formatted result', async () => {
        const mockSecretData = { dataValues: { key: 'exampleKey1', value: 'exampleValue1' } };

        Secrets.findOne.mockResolvedValue(mockSecretData);

        const result = await getSecret('exampleKey1');
        expect(result).toEqual({ key: 'exampleKey1', value: 'exampleValue1' });
    });

    it('should handle errors when getting secrest', async () => {
        const error = jest.spyOn(console, 'error').mockImplementation(() => {});
        const expectedError = new Error("Couldn't create secret");

        Secrets.findOne.mockRejectedValue(expectedError);

        const result = await getSecret('exampleKey1');

        expect(result).toBeUndefined();
        expect(error).toHaveBeenCalledWith('Error in getting all secrets: ', expectedError);
    });
});
