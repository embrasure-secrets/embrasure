import createVpc from './createVpc.js';
import createVpcSecurityGroup from './createVpcSecurityGroup.js';
import createPostgresInstance from './createPostgresInstance.js';
import createSubnets from './createDBSubnets.js';
import createSubnetGroup from './createDBSubnetGroup.js';
import createInternetGateway from './createInternetGateway.js';
import createPublicRouteTable from './createPublicRouteTable.js';
import createPrivateRouteTable from './createPrivateRouteTable.js';
import checkRDSStatus from './checkRdsStatus.js';

async function init() {
    try {
        const vpcResponse = await createVpc();
        const vpcId = vpcResponse.Vpc.VpcId;

        const internetGatewayId = await createInternetGateway(vpcId);

        const subnetGroupArr = await createSubnets(vpcId);

        const privateSubnets = [subnetGroupArr[0], subnetGroupArr[1]];
        // const publicSubnet = [subnetGroupArr[2]];
        await createSubnetGroup(privateSubnets);
        await createPublicRouteTable(vpcId, internetGatewayId);
        await createPrivateRouteTable(vpcId, subnetGroupArr); // all three subnets are intentionally placed on private route table

        const securityGroupResponse = await createVpcSecurityGroup(vpcId);
        // wrapped in array beacuse createPostgresInstance expects array
        const vpcSecurityGroupIds = [securityGroupResponse.SecurityGroupRules[0].GroupId];
        await createPostgresInstance(vpcSecurityGroupIds);
        checkRDSStatus()
            .then(() => {
                console.log('DB instance is available');
                console.log(
                    'Embrasure AWS backend sucessfully created! Please visit Amazon RDS section of https://console.aws.amazon.com/ to see the status of your new database'
                );
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

init();
