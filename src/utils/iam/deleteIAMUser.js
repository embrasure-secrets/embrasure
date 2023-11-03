import { IAMClient, DeleteUserCommand } from '@aws-sdk/client-iam';
import deleteIAMUserPolicies from './deleteIAMUserPolicies.js';
import deleteAccessKeysFromUser from './deleteAccessKeysFromUser.js';
import detachUserFromGroup from './detachUserFromGroup.js';
import detachPoliciesFromUser from './detachPoliciesFromUser.js';

const client = new IAMClient({});

async function deleteIAMUser(username) {
    try {
        const command = new DeleteUserCommand({ UserName: username });
        await detachUserFromGroup(username);
        await detachPoliciesFromUser(username);
        await deleteIAMUserPolicies(username);
        await deleteAccessKeysFromUser(username);
        await client.send(command);
    } catch (err) {
        console.error('Error in deleting IAM user: ', err);
    }
}

export default deleteIAMUser;
