import createVpc from './vpc/createVpc.js';
import createVpcSecurityGroup from './vpc/createVpcSecurityGroup.js';
import createPostgresInstance from './rds/createPostgresInstance.js';
import createSubnets from './vpc/createDBSubnets.js';
import createSubnetGroup from './rds/createDBSubnetGroup.js';
import createInternetGateway from './vpc/createInternetGateway.js';
import createPublicRouteTable from './vpc/createPublicRouteTable.js';
import createPrivateRouteTable from './vpc/createPrivateRouteTable.js';
import checkRDSStatus from './rds/checkRdsStatus.js';

async function init() {
    try {
        const vpcResponse = await createVpc();
        const vpcId = vpcResponse.Vpc.VpcId;

        const internetGatewayId = await createInternetGateway(vpcId);

        const subnetGroupArr = await createSubnets(vpcId);

        await createSubnetGroup(subnetGroupArr);
        await createPublicRouteTable(vpcId, internetGatewayId);
        await createPrivateRouteTable(vpcId, subnetGroupArr); // all subnets are intentionally placed on private route table

        const securityGroupResponse = await createVpcSecurityGroup(vpcId);
        // wrapped in array beacuse createPostgresInstance expects array
        const vpcSecurityGroupIds = [securityGroupResponse.SecurityGroupRules[0].GroupId];
        await createPostgresInstance(vpcSecurityGroupIds);
        await checkRDSStatus();
        console.log('DB instance is available');
        console.log(
            'Embrasure AWS backend successfully created! Please visit Amazon RDS section of https://console.aws.amazon.com/ to see the status of your new database'
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default init;
