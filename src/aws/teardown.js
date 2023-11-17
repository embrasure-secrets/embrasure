import deletePostgresInstance from './rds/deletePostgresInstance.js';
import deleteRDSSubnetGroup from './rds/deleteDBSubnetGroup.js';
import getVpcId from './utils/getVpcId.js';
import deleteDBSubnets from './vpc/deleteDBSubnets.js';
import getVpcSecurityGroupId from './utils/getVpcSecurityGroupId.js';
import deleteVpcSecurityGroup from './vpc/deleteVpcSecurityGroup.js';
import deleteVpc from './vpc/deleteVpc.js';
import deleteIAMUser from './iam/deleteIAMUser.js';
import getUsersInGroup from './utils/getUsersInGroup.js';

/*
Teardown flow: NOTE, YOU MUST RUN SERVERLESS REMOVE BEFORE USING THIS FILE
call deletePostgresInstance.js (this uses waitForRdsSpinDown.js and will not move past this until db is fully deleted)
call deleteDBSubnetGroup.js
call getVpcId and save to a variable (other functions require the vpc id as an argument)
call deleteDBSubnets.js
call deleteVpcSecurityGroups.js
call deleteVpc.js
*/

async function teardown() {
    try {
        const users = await getUsersInGroup('embrasure-developer');

        const userPromises = users.map((user) => deleteIAMUser(user));
        await Promise.all([userPromises]);
        await deleteIAMUser('logsworker');
        await deletePostgresInstance();
        await deleteRDSSubnetGroup();
        const vpcId = await getVpcId();

        await deleteDBSubnets(vpcId);
        const vpcSecurityGroupId = await getVpcSecurityGroupId(vpcId);

        await deleteVpcSecurityGroup(vpcSecurityGroupId);
        await deleteVpc(vpcId);
        console.log('Teardown of Embrasure complete!');
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default teardown;
