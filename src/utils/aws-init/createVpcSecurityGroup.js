import {
    EC2Client,
    CreateSecurityGroupCommand,
    AuthorizeSecurityGroupIngressCommand,
} from '@aws-sdk/client-ec2';

async function createVpcSecurityGroup(vpcId) {
    // Initialize the EC2 client
    const client = new EC2Client();

    // Specify name, description and associated vpc of new security group
    const params = {
        GroupName: 'Embrasure-PostgreSQL-Traffic-Only',
        Description: 'Embrasure created security group that only allows inbound postgresql traffic',
        VpcId: vpcId,
    };
    try {
        // Send request to create the security group to aws
        const createVpcSecurityGroupCommand = new CreateSecurityGroupCommand(params);
        const response = await client.send(createVpcSecurityGroupCommand);

        // Set Ingress rules for security group and then send rules addition request to aws
        const authorizeSecurityParams = {
            GroupId: response.GroupId,
            IpPermissions: [
                {
                    IpProtocol: 'tcp',
                    FromPort: 5432,
                    ToPort: 5432,
                    IpRanges: [{ CidrIp: '0.0.0.0/0' }],
                },
            ],
        };

        const authorizeSecurityGroupIngressCommand = new AuthorizeSecurityGroupIngressCommand(
            authorizeSecurityParams
        );
        const authorizeIngressResponse = await client.send(authorizeSecurityGroupIngressCommand);
        console.log('Inbound rule added to Vpc security group');

        return authorizeIngressResponse;
    } catch (error) {
        console.error('Could not create Vpc security group with inbound rule:', error);
    }
}

export default createVpcSecurityGroup;
