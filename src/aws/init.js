import createVpc from './vpc/createVpc.js';
import createVpcSecurityGroup from './vpc/createVpcSecurityGroup.js';
import createPostgresInstance from './rds/createPostgresInstance.js';
import createSubnets from './vpc/createDBSubnets.js';
import createSubnetGroup from './rds/createDBSubnetGroup.js';
import checkRDSStatus from './rds/checkRdsStatus.js';
import getDBArnAndEndpoint from './utils/getDBArnAndEndpoint.js';
import initNewUser from './iam/initNewUser.js';

async function init(username, password) {
    try {
        const vpcResponse = await createVpc();
        const vpcId = vpcResponse.Vpc.VpcId;

        const subnetGroupArr = await createSubnets(vpcId);

        await createSubnetGroup(subnetGroupArr);

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
            '\n\n\nGo to https://github.com/Embrasure-Secrets/embrasure-server and clone into any directory\n\n\n'
        );
        console.log(
            'Once you’ve done that, add a .env file to your embrasure-server root directory and place the following inside it:\n'
        );

        const embrasureServerlessEnvVariables = {
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

        console.log(
            '\n\n\nThen, create a .env file in your embrasure root directory and place the following inside it:\n'
        );

        const embrasureEnvVariables = {
            DATABASE_NAME: 'secrets',
            DB_USER: username,
            DB_USER_PASSWORD: password,
            DB_PORT: 5432,
            DB_HOST: endpoint,
            API_ENDPOINT: 'Replace this with the api endpoint after running serverless deploy',
        };

        Object.keys(embrasureEnvVariables).forEach((key) => {
            console.log(`${key}=${embrasureEnvVariables[key]}`);
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default init;
