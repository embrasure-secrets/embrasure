import { IAMClient, DetachUserPolicyCommand } from '@aws-sdk/client-iam';
import getPolicyARNsFromName from './getPolicyARNsFromName.js';

const client = new IAMClient();

async function detachPoliciesFromUser(username) {
    try {
        const policyARNsArr = await getPolicyARNsFromName(username);

        console.log('policy ARNs array', policyARNsArr);

        const paramsArr = policyARNsArr.map((policy) => ({
            UserName: username,
            PolicyArn: policy,
        }));

        const commandsArr = paramsArr.map((param) => {
            return new DetachUserPolicyCommand(param);
        });

        const sendPromiseArr = commandsArr.map((command) => client.send(command));

        console.log('sendPromisesArr', sendPromiseArr);

        await Promise.all(sendPromiseArr);
        console.log('Policies detached successfully');
    } catch (err) {
        console.log('Error in detaching policies: ', err);
    }
}

await detachPoliciesFromUser('steven');
export default detachPoliciesFromUser;
