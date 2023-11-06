import initNewUser from '../../../src/aws/iam/initNewUser';
import createIAMUser from '../../../src/aws/iam/setup/createIAMUser';
import createUserGroup from '../../../src/aws/iam/setup/createUserGroup';
import doesUserGroupExist from '../../../src/aws/utils/doesUserGroupExist';
import addUserToUserGroup from '../../../src/aws/iam/setup/addUserToUserGroup';
import generateAccessKeys from '../../../src/aws/iam/setup/generateAccessKey';
import createNewDBPolicy from '../../../src/aws/iam/setup/createNewDBPolicy';
import createNewUserGroupsPolicy from '../../../src/aws/iam/setup/createNewListUserGroupsPolicy';
import attachPolicyToUser from '../../../src/aws/iam/setup/attachPolicyToUser';

jest.mock('../../../src/aws/iam/setup/createIAMUser');
jest.mock('../../../src/aws/iam/setup/createUserGroup');
jest.mock('../../../src/aws/utils/doesUserGroupExist');
jest.mock('../../../src/aws/iam/setup/addUserToUserGroup');
jest.mock('../../../src/aws/iam/setup/generateAccessKey');
jest.mock('../../../src/aws/iam/setup/createNewDBPolicy');
jest.mock('../../../src/aws/iam/setup/createNewListUserGroupsPolicy');
jest.mock('../../../src/aws/iam/setup/attachPolicyToUser');

describe('initNewUser', () => {
    it('should initialize a new user successfully', async () => {
        createIAMUser.mockResolvedValue();
        doesUserGroupExist.mockResolvedValue(false);
        createUserGroup.mockResolvedValue();
        addUserToUserGroup.mockResolvedValue();
        generateAccessKeys.mockResolvedValue();
        createNewDBPolicy.mockResolvedValue('db-policy-arn');
        createNewUserGroupsPolicy.mockResolvedValue('user-groups-policy-arn');
        attachPolicyToUser.mockResolvedValue();

        await initNewUser('testUser');

        expect(createIAMUser).toHaveBeenCalledWith('testUser');
        expect(doesUserGroupExist).toHaveBeenCalledWith('embrasure-developer');
        expect(createUserGroup).toHaveBeenCalledWith('embrasure-developer');
        expect(addUserToUserGroup).toHaveBeenCalledWith('embrasure-developer', 'testUser');
        expect(generateAccessKeys).toHaveBeenCalledWith('testUser');
        expect(createNewDBPolicy).toHaveBeenCalledWith('embrasure-database-v2', 'testUser');
        expect(createNewUserGroupsPolicy).toHaveBeenCalledWith('testUser');
        expect(attachPolicyToUser).toHaveBeenCalledWith('db-policy-arn', 'testUser');
        expect(attachPolicyToUser).toHaveBeenCalledWith('user-groups-policy-arn', 'testUser');
    });

    it('should handle errors', async () => {
        const error = new Error('Connection error');
        createIAMUser.mockRejectedValue(error);

        const errorSpy = jest.spyOn(console, 'error');

        await initNewUser('testUser');

        expect(errorSpy).toHaveBeenCalledWith('Error in creating new user:', 'Connection error');

        errorSpy.mockRestore();
    });
});
