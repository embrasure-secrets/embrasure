import { EC2Client, CreateSubnetCommand } from '@aws-sdk/client-ec2';
import addNametag from '../utils/addNametag.js';

async function createSubnets(VpcId) {
    // Initialize the EC2 client
    const client = new EC2Client();
    const region = await client.config.region();

    // Specify parameters for two subnets (minimum aws requires for redundancy purposes in an aws subnet group)
    const subnetParams1 = {
        VpcId,
        AvailabilityZone: `${region}a`,
        CidrBlock: '10.0.1.0/24',
    };
    const subnetParams2 = {
        VpcId,
        AvailabilityZone: `${region}b`,
        CidrBlock: '10.0.2.0/24',
    };

    // build aws subnet creation command object
    const subnetCommand1 = new CreateSubnetCommand(subnetParams1);
    const subnetCommand2 = new CreateSubnetCommand(subnetParams2);

    try {
        // send subnet build request to aws
        const subnet1 = await client.send(subnetCommand1);
        console.log('Subnet 0 created');
        const subnet2 = await client.send(subnetCommand2);
        console.log('Subnet 1 created');
        const subnetIds = [subnet1.Subnet.SubnetId, subnet2.Subnet.SubnetId];
        // Build and then send request to add name tags to each subnet
        subnetIds.forEach((id, idx) => {
            addNametag(id, `Embrasure-Subnet-${idx}`);
        });
        return subnetIds;
    } catch (error) {
        console.error('Error in creating DB subnets', error.message);
        throw error;
    }
}

export default createSubnets;
