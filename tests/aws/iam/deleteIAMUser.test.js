import { IAMClient, DeleteUserCommand } from '@aws-sdk/client-iam';
import deleteIAMUserPolicies from '../../../src/aws/iam/teardown/deleteIAMUserPolicies';
import deleteAccessKeysFromUser from '../../../src/aws/iam/teardown/deleteAccessKeysFromUser.js';
import detachUserFromGroup from '../../../src/aws/iam/teardown/detachUserFromGroup.js';
import detachPoliciesFromUser from '../../../src/aws/iam/teardown/detachPoliciesFromUser';
import deleteIAMUser from '../../../src/aws/iam/deleteIAMUser';

jest.mock('@aws-sdk/client-iam');
jest.mock('../../../src/aws/iam/teardown/deleteIAMUserPolicies');
jest.mock('../../../src/aws/iam/teardown/deleteAccessKeysFromUser');
jest.mock('../../../src/aws/iam/teardown/detachUserFromGroup');
jest.mock('../../../src/aws/iam/teardown/detachPoliciesFromUser');

describe('deleteIAMUser', () => {
    it('should initialize a new user successfully', async () => {
        const username = 'testUser';

        detachUserFromGroup.mockResolvedValue();
        detachPoliciesFromUser.mockResolvedValue();
        deleteIAMUserPolicies.mockResolvedValue();
        deleteAccessKeysFromUser.mockResolvedValue();

        await deleteIAMUser(username);

        expect(detachUserFromGroup).toHaveBeenCalledWith(username);
        expect(detachPoliciesFromUser).toHaveBeenCalledWith(username);
        expect(deleteIAMUserPolicies).toHaveBeenCalledWith(username);
        expect(deleteAccessKeysFromUser).toHaveBeenCalledWith(username);
    });

    it('should handle errors', async () => {
        const username = 'testUser';

        const error = new Error('Could not detach user from group');
        detachUserFromGroup.mockRejectedValue(error);

        const errorSpy = jest.spyOn(console, 'error');

        await deleteIAMUser(username);

        expect(errorSpy).toHaveBeenCalledWith('Error in deleting IAM user: ', error);
    });
});
