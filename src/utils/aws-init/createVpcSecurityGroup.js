import {
    EC2Client,
    CreateSecurityGroupCommand,
    AuthorizeSecurityGroupIngressCommand,
} from '@aws-sdk/client-ec2';

async function createVpcSecurityGroup(vpcId) {
    const ec2Client = new EC2Client({ region: 'us-east-1' });

    const params = {
        GroupName: 'Embrasure-open-traffic',
        Description: 'Embrasure created open security group that allows all network traffic in',
        VpcId: vpcId,
    };
    try {
        const createVpcSecurityGroupCommand = new CreateSecurityGroupCommand(params);
        const response = await ec2Client.send(createVpcSecurityGroupCommand);
        console.log('Vpc security group created:', response);
        // response.GroupId

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

        const authorizeResponse = await ec2Client.send(authorizeSecurityGroupIngressCommand);

        console.log('Inbound rule added to Vpc security group:', authorizeResponse);
        return authorizeResponse;
    } catch (error) {
        console.error('Could not create Vpc security group with inbound rule:', error);
    }
}

export default createVpcSecurityGroup;
