import { IAMClient, DeletePolicyCommand } from '@aws-sdk/client-iam';
import getPolicyARNsFromName from './getPolicyARNsFromName.js';

const client = new IAMClient({});

async function deleteIAMUserPolicies(username) {
    try {
        const policyARNsArr = await getPolicyARNsFromName(username);

        const paramsArr = policyARNsArr.map((policy) => ({
            PolicyArn: policy,
        }));

        const commandsArr = paramsArr.map((param) => {
            return new DeletePolicyCommand(param);
        });

        const sendPromiseArr = commandsArr.map((command) => client.send(command));

        await Promise.all(sendPromiseArr);

        console.log(`Policies of ${username} have been deleted.`);
    } catch (err) {
        console.error('Error in deleting policies: ', err);
    }
}

export default deleteIAMUserPolicies;
