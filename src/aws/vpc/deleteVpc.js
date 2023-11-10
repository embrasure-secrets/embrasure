import { EC2Client, DeleteVpcCommand } from '@aws-sdk/client-ec2';

async function deleteVpc(vpcId) {
    const client = new EC2Client();
    const command = new DeleteVpcCommand({
        VpcId: vpcId,
    });

    try {
        await client.send(command);
        console.log('VPC deleted successfully.');
    } catch (error) {
        console.error('Error deleting VPC:', error);
        throw error;
    }
}

export default deleteVpc;
