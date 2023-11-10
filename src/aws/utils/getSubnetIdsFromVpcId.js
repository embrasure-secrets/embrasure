import { EC2Client, DescribeSubnetsCommand } from '@aws-sdk/client-ec2';

async function getSubnetIdsFromVpcId(vpcId) {
    const client = new EC2Client();

    // Describe subnets in the specified VPC
    const describeSubnetsCommand = new DescribeSubnetsCommand({
        Filters: [
            {
                Name: 'vpc-id',
                Values: [vpcId],
            },
        ],
    });

    try {
        const describeSubnetsResponse = await client.send(describeSubnetsCommand);
        const subnets = describeSubnetsResponse.Subnets;
        const subnetIds = subnets.map((subnet) => subnet.SubnetId);

        // Log or process the subnets as needed
        console.log('Subnets in VPCs Ids:', subnetIds);
        return subnetIds;
    } catch (error) {
        console.error('Error describing subnets:', error);
        return [];
    }
}

export default getSubnetIdsFromVpcId;
