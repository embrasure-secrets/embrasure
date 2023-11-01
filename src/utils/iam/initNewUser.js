import createIAMUser from './createIAMUser.js';
import createUserGroup from './createUserGroup.js';
import doesUserGroupExist from './doesUserGroupExist.js';
import addUserToUserGroup from './addUserToUserGroup.js';
import generateAccessKeys from './generateAccessKey.js';
import createNewDBPolicy from './createNewDBPolicy.js';
import attachPolicyToUser from './attachPolicyToUser.js';

async function initNewUser(IAMUsername) {
    try {
        await createIAMUser(IAMUsername);
        const userGroupExists = await doesUserGroupExist('developer');
        if (!userGroupExists) {
            await createUserGroup('developer');
        }
        await addUserToUserGroup('developer', IAMUsername);
        await generateAccessKeys(IAMUsername);
        console.log(`GIVE AWS ACCESS KEYS TO ${IAMUsername}`);
        const policyARN = await createNewDBPolicy('embrasure-database-v2', IAMUsername);
        await attachPolicyToUser(policyARN, IAMUsername);
    } catch (error) {
        console.error('Error in creating new user:', error.message);
    }
}

export default initNewUser;
