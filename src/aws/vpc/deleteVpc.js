import { EC2Client, DeleteVpcCommand } from '@aws-sdk/client-ec2';

async function deleteVpc(vpcId) {
    const client = new EC2Client();
    const command = new DeleteVpcCommand({
        VpcId: vpcId,
    });

    try {
        const response = await client.send(command);
        console.log('VPC deleted successfully:', response);
    } catch (error) {
        console.error('Error deleting VPC:', error);
    }
}

export default deleteVpc;
