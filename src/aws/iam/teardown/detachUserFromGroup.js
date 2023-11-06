import { IAMClient, RemoveUserFromGroupCommand } from '@aws-sdk/client-iam';

const iamClient = new IAMClient();

async function detachUserFromGroup(username) {
    const groupName = 'embrasure-developer';

    const removeUserFromGroupParams = {
        GroupName: groupName,
        UserName: username,
    };

    const removeUserFromGroupCommand = new RemoveUserFromGroupCommand(removeUserFromGroupParams);

    try {
        await iamClient.send(removeUserFromGroupCommand);
        console.log(`User "${username}" has been removed from group "${groupName}".`);
    } catch (error) {
        console.error(`Error removing user from group: ${error.message}`);
    }
}

export default detachUserFromGroup;
