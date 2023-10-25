import updateSecret from '../src/utils/rds/updateSecret.js';
import Secrets from '../src/utils/rds/model.js';

jest.mock('../src/utils/rds/model.js', () => {
    return {
        update: jest.fn(),
    };
});

describe('updateSecret', () => {
    it('should update secret and return 1', async () => {
        const numberOfRecordsUpdated = 1;

        Secrets.update.mockResolvedValue(numberOfRecordsUpdated);

        const result = await updateSecret('exampleKey1');

        expect(result).toBe(1);
    });

    it('should handle errors when updating secret', async () => {
        const error = jest.spyOn(console, 'error').mockImplementation(() => {});
        const expectedError = new Error("Couldn't update secret");

        Secrets.update.mockRejectedValue(expectedError);

        const result = await updateSecret('exampleKey1');

        expect(result).toBeUndefined();
        expect(error).toHaveBeenCalledWith('Error in updating record: ', expectedError);
    });
});
