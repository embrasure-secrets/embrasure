import { EC2Client, DescribeVpcsCommand } from '@aws-sdk/client-ec2';

async function getVpcId() {
    const client = new EC2Client();
    const vpcName = 'Embrasure-VPC-v5';

    const command = new DescribeVpcsCommand({
        Filters: [
            {
                Name: 'tag:Name',
                Values: [vpcName],
            },
        ],
    });

    try {
        const response = await client.send(command);
        const vpcs = response.Vpcs;
        let vpcId;

        if (vpcs.length > 0) {
            vpcId = vpcs[0].VpcId;
            console.log(`VPC ID for ${vpcName}: ${vpcId}`);
        } else {
            console.log(`No VPC found with the name ${vpcName}`);
        }
        return vpcId;
    } catch (error) {
        console.error('Error getting VPC details:', error);
    }
}

export default getVpcId;
