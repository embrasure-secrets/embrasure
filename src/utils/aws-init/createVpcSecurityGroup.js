import {
    EC2Client,
    CreateSecurityGroupCommand,
    AuthorizeSecurityGroupIngressCommand,
} from '@aws-sdk/client-ec2';

async function createVpcSecurityGroup(vpcId) {
    // Initialize the EC2 client
    const client = new EC2Client({ region: 'us-east-1' });

    // Specify name, description and associated vpc of new security group
    const params = {
        GroupName: 'Embrasure-open-traffic',
        Description: 'Embrasure created open security group that allows all network traffic in',
        VpcId: vpcId,
    };
    try {
        // Send request to create the security group to aws
        const createVpcSecurityGroupCommand = new CreateSecurityGroupCommand(params);
        const response = await client.send(createVpcSecurityGroupCommand);

        // Set Ingress (incoming requests) rules for security group and then send rules addition request to aws
        const authorizeIngressParams = {
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
            authorizeIngressParams
        );

        const authorizeResponse = await client.send(authorizeSecurityGroupIngressCommand);

        console.log('Inbound rule added to Vpc security group:', authorizeResponse);
        return authorizeResponse;
    } catch (error) {
        console.error('Could not create Vpc security group with inbound rule:', error);
    }
}

export default createVpcSecurityGroup;
