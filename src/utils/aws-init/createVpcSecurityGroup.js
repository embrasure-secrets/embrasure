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
        GroupName: 'Embrasure-all-traffic',
        Description: 'Embrasure created open security group that allows all traffic in',
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
                    IpProtocol: '-1',
                    FromPort: -1,
                    ToPort: -1,
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
