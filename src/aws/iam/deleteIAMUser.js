import { IAMClient, DeleteUserCommand } from '@aws-sdk/client-iam';
import deleteIAMUserPolicies from './teardown/deleteIAMUserPolicies.js';
import deleteAccessKeysFromUser from './teardown/deleteAccessKeysFromUser.js';
import detachUserFromGroup from './teardown/detachUserFromGroup.js';
import detachPoliciesFromUser from './teardown/detachPoliciesFromUser.js';

const client = new IAMClient({});

async function deleteIAMUser(username) {
    try {
        const command = new DeleteUserCommand({ UserName: username });
        await detachUserFromGroup(username);
        await detachPoliciesFromUser(username);
        await deleteIAMUserPolicies(username);
        await deleteAccessKeysFromUser(username);
        await client.send(command);
    } catch (error) {
        console.error('Error in deleting IAM user: ', error);
        throw error;
    }
}

export default deleteIAMUser;
