// Import required AWS SDK clients and commands for Node.js
import { IAMClient, CreatePolicyCommand } from '@aws-sdk/client-iam';
import getUserArn from '../../utils/getUserArn.js';

async function createNewUserGroupsPolicy(IAMUsername) {
    let userArn = await getUserArn(IAMUsername);
    if (IAMUsername === 'logsworker') {
        userArn = 'arn:aws:iam::*:user/*';
    }
    const policyName = `embrasure-allow-list-groups-${IAMUsername}`;

    const policyDocument = {
        Version: '2012-10-17',
        Statement: [
            {
                Effect: 'Allow',
                Action: ['iam:ListGroupsForUser', 'iam:GetUser'],
                Resource: [userArn], // 'arn:aws:iam::12341234123:user/robert'
            },
        ],
    };

    const iamClient = new IAMClient();

    // Set the parameters
    const params = {
        PolicyName: policyName,
        PolicyDocument: JSON.stringify(policyDocument),
    };

    try {
        const data = await iamClient.send(new CreatePolicyCommand(params));
        console.log('Policy created successfully');
        console.log(`Policy Name is: ${policyName}`);
        console.log(`Policy ARN is: ${data.Policy.Arn}`);
        return data.Policy.Arn;
    } catch (error) {
        console.error('Error in creating policy', error);
        throw error;
    }
}

export default createNewUserGroupsPolicy;
