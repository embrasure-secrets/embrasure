import { IAMClient, ListGroupsForUserCommand } from '@aws-sdk/client-iam';

const iamClient = new IAMClient();

// Takes two arguments, AWS username and AWS group name
// Returns true if user belonsg to group, false otherwise
async function isUserInGroup(username, groupName) {
    try {
        const params = { UserName: username };
        const { Groups: GroupsArr } = await iamClient.send(new ListGroupsForUserCommand(params));

        const groups = GroupsArr.map((group) => group.GroupName);

        return groups.includes(groupName);
    } catch (error) {
        console.error(`Couldn't check if ${username} is in ${groupName}`, error.message);
    }
}

export default isUserInGroup;
