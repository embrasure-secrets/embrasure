// Import required AWS SDK clients and commands for Node.js
import { IAMClient, CreatePolicyCommand } from '@aws-sdk/client-iam';
import getFormattedResourceArn from '../getFormattedResourceArn.js';

async function createNewDBPolicy(dbInstanceIdentifier = 'embrasure-database-v2', IAMUsername) {
    const resourceArn = await getFormattedResourceArn(dbInstanceIdentifier, IAMUsername);

    const policyName = `embrasure-allow-connect-${IAMUsername}`;

    const policyDocument = {
        Version: '2012-10-17',
        Statement: [
            {
                Effect: 'Allow',
                Action: ['rds-db:connect'],
                Resource: [resourceArn], // "arn:aws:rds-db:us-east-2:330917834855:dbuser:db-AMNI53M4CJBHQQDAAONIF4A63A/iamuser"
            },
        ],
    };

    const iamClient = new IAMClient(); // previously: new IAMClient({ region: REGION })
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
    } catch (err) {
        console.error('Error in creating policy', err);
    }
}

export default createNewDBPolicy;
