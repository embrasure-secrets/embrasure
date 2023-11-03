import { IAMClient, ListPoliciesCommand } from '@aws-sdk/client-iam';
const iamClient = new IAMClient();

async function getPolicyARNsFromName(username) {
    const connectPolicyName = `embrasure-allow-connect-${username}`;
    const groupsPolicyName = `embrasure-allow-list-groups-${username}`;

    const listPoliciesParams = { Scope: 'All' };
    const listPoliciesCommand = new ListPoliciesCommand(listPoliciesParams);

    try {
        const { Policies } = await iamClient.send(listPoliciesCommand);
        const policyARNs = Policies.filter((p) =>
            [connectPolicyName, groupsPolicyName].includes(p.PolicyName)
        ).map((p) => p.Arn);

        return policyARNs;
    } catch (error) {
        console.error(`Error listing policies: ${error.message}`);
    }
}

export default getPolicyARNsFromName;
