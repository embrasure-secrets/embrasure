import { EC2Client, DeleteSubnetCommand } from '@aws-sdk/client-ec2';
import getSubnetIdsFromVpcId from '../utils/getSubnetIdsFromVpcId.js';

// Set up the EC2 client
const client = new EC2Client(); // Replace 'your-region' with your AWS region

async function deleteDBSubnets(vpcId) {
    try {
        // Specify the Subnet ID that you want to delete
        const subnetIds = await getSubnetIdsFromVpcId(vpcId);
        const subnetDeletionCommands = subnetIds.map(
            (id) => new DeleteSubnetCommand({ SubnetId: id })
        );
        // Create the DeleteSubnetCommand

        // Call the EC2 client to delete the subnet
        const responses = await Promise.all(
            subnetDeletionCommands.map((deleteSubnetCommand) => client.send(deleteSubnetCommand))
        );

        responses.forEach((response) => {
            console.log('Subnet deleted successfully:', response);
        });
    } catch (error) {
        console.error('Error deleting subnets:', error);
        throw error;
    }
}

export default deleteDBSubnets;
