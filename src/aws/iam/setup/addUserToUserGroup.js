import { AddUserToGroupCommand, IAMClient } from '@aws-sdk/client-iam';

/*
Given a user group name and user name
both as strings, addUserToUserGroup function
will add the user to the user group

Function is idempotent - adding a user 
that is already in the user group will
return a successful response and not 
an error.
*/

async function addUserToUserGroup(groupName, userName) {
    try {
        const iamClient = new IAMClient();

        const addUserToGroupCommand = new AddUserToGroupCommand({
            GroupName: groupName,
            UserName: userName,
        });
        const addUserToGroupResponse = await iamClient.send(addUserToGroupCommand);
        console.log(`${userName} successfully added to ${groupName} IAM usergroup`);
        /*
      addUserToGroupResponse has the following structure: 
      {
        '$metadata': {
          httpStatusCode: 200,
          requestId: 'a0f5533d-020d-4919-8a09-21419bcef7ee',
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        }
      }
    */
        return addUserToGroupResponse;
    } catch (error) {
        console.error('Error in adding user to user group: ', error);
        throw error;
    }
}

export default addUserToUserGroup;
