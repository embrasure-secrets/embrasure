import { EC2Client, CreateSubnetCommand } from '@aws-sdk/client-ec2';
import addNametag from './addNametag.js';

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
    const subnetParams3 = {
        VpcId,
        AvailabilityZone: 'us-east-1c',
        CidrBlock: '10.0.3.0/24',
    };

    // build aws subnet creation command object
    const subnetCommand1 = new CreateSubnetCommand(subnetParams1);
    const subnetCommand2 = new CreateSubnetCommand(subnetParams2);
    const subnetCommand3 = new CreateSubnetCommand(subnetParams3);
    try {
        // send subnet build request to aws
        const subnet1 = await client.send(subnetCommand1);
        console.log('Subnet 0 created');
        const subnet2 = await client.send(subnetCommand2);
        console.log('Subnet 1 created');
        const subnet3 = await client.send(subnetCommand3);
        console.log('Subnet 2 created');
        const subnetIds = [
            subnet1.Subnet.SubnetId,
            subnet2.Subnet.SubnetId,
            subnet3.Subnet.SubnetId,
        ];
        // Build and then send request to add name tags to each subnet
        subnetIds.forEach((id, idx) => {
            addNametag(id, `Embrasure-Subnet-${idx}`);
        });
        return subnetIds;
    } catch (e) {
        console.error(e);
    }
}

export default createSubnets;
