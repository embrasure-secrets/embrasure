import { IAMClient, AttachUserPolicyCommand } from '@aws-sdk/client-iam';

/*
Given a policy ARN and an IAM username
both as strings, attachPolicyToUser function
will attach the policy directly to
the IAM user
*/

async function attachPolicyToUser(policyARN, IAMUsername) {
    const params = {
        PolicyArn: policyARN,
        UserName: IAMUsername,
    };

    // Create an IAM client service object
    const client = new IAMClient();

    try {
        const attachPolicyResponse = await client.send(new AttachUserPolicyCommand(params));
        /*
      data has the following structure: 
      {
      '$metadata': {
        httpStatusCode: 200,
        requestId: '5dabe9ce-723f-492b-a683-163eeb70019a',
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
        }
      }
    */
        console.log(`Policy attached successfully to ${IAMUsername}`);
        return attachPolicyResponse;
    } catch (err) {
        console.error('Error in attaching policy to user:', err);
    }
}

// Code to test attaching IAMFullAccess policy to IAM user named "new-user-bob"
// const IAMUsername = "new-user-bob";
// const policyARN = "arn:aws:iam::aws:policy/IAMFullAccess";
// attachPolicyToUser(policyARN, IAMUsername);

export default attachPolicyToUser;
