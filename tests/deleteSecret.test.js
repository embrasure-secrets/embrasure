import deleteSecret from '../src/utils/rds/deleteSecret.js';
import Secrets from '../src/utils/rds/model.js';

jest.mock('../src/utils/rds/model.js', () => {
    return {
        destroy: jest.fn(),
    };
});

describe('deleteSecret', () => {
    it('should delete a secret and return 1', async () => {
        const numberOfRecordsDeleted = 1;

        Secrets.destroy.mockResolvedValue(numberOfRecordsDeleted);

        const result = await deleteSecret('exampleKey1');

        expect(result).toBe(1);
    });

    it('should handle errors when getting secrets', async () => {
        const error = jest.spyOn(console, 'error').mockImplementation(() => {});
        const expectedError = new Error("Couldn't delete secret");

        Secrets.destroy.mockRejectedValue(expectedError);

        const result = await deleteSecret('exampleKey1');

        expect(result).toBeUndefined();
        expect(error).toHaveBeenCalledWith('Error in deleting secret: ', expectedError);
    });
});
