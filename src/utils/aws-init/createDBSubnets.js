import { EC2Client, CreateSubnetCommand } from '@aws-sdk/client-ec2';

async function createSubnets(VpcId) {
    const Client = new EC2Client({ region: 'us-east-1' });
    const subnetParams1 = {
        VpcId: VpcId,
        AvailabilityZone: 'us-east-1a',
        CidrBlock: '10.0.1.0/24',
    };
    const subnetParams2 = {
        VpcId: VpcId,
        AvailabilityZone: 'us-east-1b',
        CidrBlock: '10.0.2.0/24',
    };

    const subnetCommand1 = new CreateSubnetCommand(subnetParams1);
    const subnetCommand2 = new CreateSubnetCommecand(subnetParams2);
    try {
        const subnet1 = await Client.send(subnetCommand1);
        const subnet2 = await Client.send(subnetCommand2);

        // const tagsParams = {
        //   Resources: [subnetId],
        //   Tags: [
        //     {
        //       Key: "Name",
        //       Value: `Subnet ${idx}`, // Replace with the desired name for your subnet
        //     },
        //   ],
        // };

        return [subnet1.Subnet.SubnetId, subnet2.Subnet.SubnetId];
    } catch (e) {
        console.error(e);
    }
}

export default createSubnets;
