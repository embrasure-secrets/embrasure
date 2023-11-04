import { IAMClient, ListGroupsCommand } from '@aws-sdk/client-iam';

const client = new IAMClient();

async function doesUserGroupExist(userGroup) {
    try {
        const command = new ListGroupsCommand({});
        const { Groups: groupsArr } = await client.send(command);

        const groups = groupsArr.map(({ GroupName }) => GroupName);
        return groups.includes(userGroup);
    } catch (err) {
        console.error('Error in getting IAM user groups:', err);
    }
}

export default doesUserGroupExist;
