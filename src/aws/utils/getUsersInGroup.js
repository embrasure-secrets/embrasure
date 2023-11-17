import { IAMClient, GetGroupCommand } from '@aws-sdk/client-iam';

const client = new IAMClient();

async function getUsersInGroup(groupName) {
    try {
        const { Users: userObjs } = await client.send(
            new GetGroupCommand({ GroupName: groupName })
        );

        const users = userObjs.map(({ UserName }) => UserName);
        return users;
    } catch (error) {
        console.error(`Error getting IAM users in the group "${groupName}":`, error);
        throw error;
    }
}

export default getUsersInGroup;
