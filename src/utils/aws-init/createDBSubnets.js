import { EC2Client, CreateSubnetCommand, CreateTagsCommand } from '@aws-sdk/client-ec2';

async function createSubnets(VpcId) {
    const Client = new EC2Client({ region: 'us-east-1' });
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

    const subnetCommand1 = new CreateSubnetCommand(subnetParams1);
    const subnetCommand2 = new CreateSubnetCommand(subnetParams2);
    try {
        const subnet1 = await Client.send(subnetCommand1);
        const subnet2 = await Client.send(subnetCommand2);
        const subnetIds = [subnet1.Subnet.SubnetId, subnet2.Subnet.SubnetId];
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
            await Client.send(createTagsCommand);
        });
        return subnetIds;
    } catch (e) {
        console.error(e);
    }
}

export default createSubnets;
