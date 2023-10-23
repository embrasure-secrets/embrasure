import createVpc from './createVpc.js';
import createVpcSecurityGroup from './createVpcSecurityGroup.js';
import createPostgresInstance from './createPostgresInstance.js';
import createSubnets from './createDBSubnets.js';
import createSubnetGroup from './createDBSubnetGroup.js';

try {
    const vpcResponse = await createVpc();
    const vpcId = vpcResponse.Vpc.VpcId;
    const subnetGroupArr = await createSubnets(vpcId);
    await createSubnetGroup(subnetGroupArr);
    const securityGroupResponse = await createVpcSecurityGroup(vpcId);
    // wrapped in array beacuse createPostgresInstance expects array
    const vpcSecurityGroupIds = [securityGroupResponse.SecurityGroupRules[0].GroupId];
    await createPostgresInstance(vpcSecurityGroupIds);

    console.log(
        'Amazon RDS for Postgres Instance successfully created!, visit https://console.aws.amazon.com/rds/ to see the status of your new database'
    );
} catch (error) {
    console.error(error);
    throw error;
}
