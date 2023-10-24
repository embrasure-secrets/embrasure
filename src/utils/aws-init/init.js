import createVpc from './createVpc.js';
import createVpcSecurityGroup from './createVpcSecurityGroup.js';
import createPostgresInstance from './createPostgresInstance.js';
import createSubnets from './createDBSubnets.js';
import createSubnetGroup from './createDBSubnetGroup.js';
import createInternetGateway from './createInternetGateway.js';
import createRouteTable from './createRouteTable.js';

async function init() {
    try {
        const vpcResponse = await createVpc();
        const vpcId = vpcResponse.Vpc.VpcId;

        const internetGatewayId = await createInternetGateway(vpcId);

        const subnetGroupArr = await createSubnets(vpcId);
        await createSubnetGroup(subnetGroupArr);
        await createRouteTable(vpcId, internetGatewayId, subnetGroupArr);

        const securityGroupResponse = await createVpcSecurityGroup(vpcId);
        // wrapped in array beacuse createPostgresInstance expects array
        const vpcSecurityGroupIds = [securityGroupResponse.SecurityGroupRules[0].GroupId];
        await createPostgresInstance(vpcSecurityGroupIds);

        console.log(
            'Amazon RDS for Postgres Instance successfully created!, visit Amazon RDS section of https://console.aws.amazon.com/ to see the status of your new database'
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}

init();
