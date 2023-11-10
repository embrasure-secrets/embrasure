import createVpc from './vpc/createVpc.js';
import createVpcSecurityGroup from './vpc/createVpcSecurityGroup.js';
import createPostgresInstance from './rds/createPostgresInstance.js';
import createSubnets from './vpc/createDBSubnets.js';
import createSubnetGroup from './rds/createDBSubnetGroup.js';
import createInternetGateway from './vpc/createInternetGateway.js';
import createPublicRouteTable from './vpc/createPublicRouteTable.js';
import createPrivateRouteTable from './vpc/createPrivateRouteTable.js';
import checkRDSStatus from './rds/checkRdsStatus.js';
import getDBArnAndEndpoint from './utils/getDBArnAndEndpoint.js';
import initNewUser from './iam/initNewUser.js';

async function init(username, password) {
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
        await createPostgresInstance(vpcSecurityGroupIds, username, password);
        await checkRDSStatus();
        const { endpoint } = await getDBArnAndEndpoint();

        console.log(
            "DB instance is available! Theres a little bit more before Embrasure's setup is done."
        );

        // create logs worker
        const { accessKey, secretAccessKey } = await initNewUser('logsworker');
        console.log(
            'Go to https://github.com/Embrasure-Secrets/embrasure-server and clone into any directory'
        );
        console.log(
            'Once you’ve done that, add a .env file to that embrasure-server root directory and copy this:'
        );
        const embrasureServerlessEnvVariables = {
            DATABASE_NAME: 'secrets',
            DB_USER: username,
            DB_USER_PASSWORD: password,
            DB_PORT: 5432,
            API_PORT: 3000,
            DB_HOST: endpoint,
            SECURITY_GROUP_ID: vpcSecurityGroupIds[0],
            SUBNET_0_ID: subnetGroupArr[0],
            SUBNET_1_ID: subnetGroupArr[1],
            LOGS_WORKER_ACCESS_KEY: accessKey,
            LOGS_WORKER_SECRET_ACCESS_KEY: secretAccessKey,
            AWS_REGION: 'Whatever-aws-region-your-team-is-using',
            REGION: 'Whatever-aws-region-your-team-is-using',
        };
        Object.keys(embrasureServerlessEnvVariables).forEach((key) => {
            console.log(`${key}=${embrasureServerlessEnvVariables[key]}`);
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default init;
