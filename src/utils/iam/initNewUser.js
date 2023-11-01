import createIAMUser from './createIAMUser.js';
import createUserGroup from './createUserGroup.js';
import addUserToUserGroup from './addUserToUserGroup.js';
import generateAccessKeys from './generateAccessKey.js';
import createNewDBPolicy from './createNewDBPolicy.js';
import attachPolicyToUser from './attachPolicyToUser.js';

const IAMUsername = 'bob';

await createIAMUser(IAMUsername);
await createUserGroup('developer');
await addUserToUserGroup('developer', IAMUsername);
await generateAccessKeys(IAMUsername);
console.log(`GIVE AWS ACCESS KEYS TO ${IAMUsername}`);
const policyARN = await createNewDBPolicy('database-secrets', IAMUsername);
await attachPolicyToUser(policyARN, IAMUsername);
