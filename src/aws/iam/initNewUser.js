import createIAMUser from './setup/createIAMUser.js';
import createUserGroup from './setup/createUserGroup.js';
import doesUserGroupExist from '../utils/doesUserGroupExist.js';
import addUserToUserGroup from './setup/addUserToUserGroup.js';
import generateAccessKeys from './setup/generateAccessKey.js';
import createNewDBPolicy from './setup/createNewDBPolicy.js';
import createNewUserGroupsPolicy from './setup/createNewListUserGroupsPolicy.js';
import attachPolicyToUser from './setup/attachPolicyToUser.js';

async function initNewUser(IAMUsername) {
    try {
        await createIAMUser(IAMUsername);
        const userGroupExists = await doesUserGroupExist('embrasure-developer');
        if (!userGroupExists) {
            await createUserGroup('embrasure-developer');
        }
        await addUserToUserGroup('embrasure-developer', IAMUsername);
        const accessKeys = await generateAccessKeys(IAMUsername);
        console.log(`GIVE AWS ACCESS KEYS TO ${IAMUsername}`);
        const dbPolicyARN = await createNewDBPolicy('embrasure-database-v2', IAMUsername);
        const groupsPolicyARN = await createNewUserGroupsPolicy(IAMUsername);
        await attachPolicyToUser(dbPolicyARN, IAMUsername);
        await attachPolicyToUser(groupsPolicyARN, IAMUsername);
        return accessKeys;
    } catch (error) {
        console.error('Error in creating new user:', error.message);
        throw error;
    }
}

export default initNewUser;
