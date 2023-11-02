import createIAMUser from './createIAMUser.js';
import createUserGroup from './createUserGroup.js';
import doesUserGroupExist from './doesUserGroupExist.js';
import addUserToUserGroup from './addUserToUserGroup.js';
import generateAccessKeys from './generateAccessKey.js';
import createNewDBPolicy from './createNewDBPolicy.js';
import createNewUserGroupsPolicy from './createNewListUserGroupsPolicy.js';
import attachPolicyToUser from './attachPolicyToUser.js';

async function initNewUser(IAMUsername) {
    try {
        await createIAMUser(IAMUsername);
        const userGroupExists = await doesUserGroupExist('embrasure-developer');
        if (!userGroupExists) {
            await createUserGroup('embrasure-developer');
        }
        await addUserToUserGroup('embrasure-developer', IAMUsername);
        await generateAccessKeys(IAMUsername);
        console.log(`GIVE AWS ACCESS KEYS TO ${IAMUsername}`);
        const dbPolicyARN = await createNewDBPolicy('embrasure-database-v2', IAMUsername);
        const groupsPolicyARN = await createNewUserGroupsPolicy(IAMUsername);
        await attachPolicyToUser(dbPolicyARN, IAMUsername);
        await attachPolicyToUser(groupsPolicyARN, IAMUsername);
    } catch (error) {
        console.error('Error in creating new user:', error.message);
    }
}

export default initNewUser;
