import { EC2Client, CreateSubnetCommand, CreateTagsCommand } from '@aws-sdk/client-ec2';

async function createSubnets(VpcId) {
    // Initialize the EC2 client
    const client = new EC2Client({ region: 'us-east-1' });

    // Specify parameters for two subnets (minimum aws requires for redundancy purposes in an aws subnet group)
    const subnetParams1 = {
        VpcId,
        AvailabilityZone: 'us-east-1a',
        CidrBlock: '10.0.1.0/24',
    };
    const subnetParams2 = {
        VpcId,
        AvailabilityZone: 'us-east-1b',
        CidrBlock: '10.0.2.0/24',
    };

    // build aws subnet creation command object
    const subnetCommand1 = new CreateSubnetCommand(subnetParams1);
    const subnetCommand2 = new CreateSubnetCommand(subnetParams2);
    try {
        // send subnet build request to aws
        const subnet1 = await client.send(subnetCommand1);
        const subnet2 = await client.send(subnetCommand2);
        const subnetIds = [subnet1.Subnet.SubnetId, subnet2.Subnet.SubnetId];
        // Build and then send request to add name tags to each subnet
        subnetIds.forEach(async (id, idx) => {
            const tagsParams = {
                Resources: [id],
                Tags: [
                    {
                        Key: 'Name',
                        Value: `Embrasure-Subnet-${idx}`,
                    },
                ],
            };
            const createTagsCommand = new CreateTagsCommand(tagsParams);
            await client.send(createTagsCommand);
        });
        return subnetIds;
    } catch (e) {
        console.error(e);
    }
}

export default createSubnets;
