import { CreateGroupCommand, IAMClient } from '@aws-sdk/client-iam';

/*
Given a groupName as a string, 
createIAMUserGroup will create a 
new IAM User Group with no
users and no policies 
*/

async function createUserGroup(groupName) {
    try {
        const iamClient = new IAMClient();
        const createGroupCommand = new CreateGroupCommand({ GroupName: groupName });

        const groupCreationResponse = await iamClient.send(createGroupCommand);
        console.log('User group successfully created: ', groupCreationResponse);
        /*
      groupCreationResponse has the following structure: 
      {
        '$metadata': {
          httpStatusCode: 200,
          requestId: 'd06825b4-d620-490f-9f8f-15a073b409ec',
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        Group: {
          Path: '/',
          GroupName: 'new-user-group2',
          GroupId: 'AGPAU2DB5OBTSWKENGAZI',
          Arn: 'arn:aws:iam::330917834855:group/new-user-group2',
          CreateDate: 2023-10-25T20:14:37.000Z
        }
      }
    */
        return groupCreationResponse;
    } catch (err) {
        console.error('Error in creating new user group', err);
    }
}

export default createUserGroup;
