import { IAMClient, DetachUserPolicyCommand } from '@aws-sdk/client-iam';
import getPolicyARNsFromName from '../../utils/getPolicyARNsFromName.js';

const client = new IAMClient();

async function detachPoliciesFromUser(username) {
    try {
        const policyARNsArr = await getPolicyARNsFromName(username);

        const paramsArr = policyARNsArr.map((policy) => ({
            UserName: username,
            PolicyArn: policy,
        }));

        const commandsArr = paramsArr.map((param) => {
            return new DetachUserPolicyCommand(param);
        });

        const sendPromiseArr = commandsArr.map((command) => client.send(command));

        await Promise.all(sendPromiseArr);
        console.log('Policies detached successfully');
    } catch (error) {
        console.log('Error in detaching policies: ', error);
        throw error;
    }
}

export default detachPoliciesFromUser;
