import { EC2Client, DeleteSecurityGroupCommand } from '@aws-sdk/client-ec2';

// Set up the EC2 client
const client = new EC2Client(); // Replace 'your-region' with your AWS region

async function deleteVpcSecurityGroup(securityGroupId) {
    // Create the DeleteSecurityGroupCommand
    const deleteSecurityGroupCommand = new DeleteSecurityGroupCommand({
        GroupId: securityGroupId,
    });

    // Call the EC2 client to delete the security group
    try {
        const response = await client.send(deleteSecurityGroupCommand);
        console.log('security group deleted. response: ', response);
    } catch (error) {
        console.error('Error deleting Security Group:', error);
        throw error;
    }
}

export default deleteVpcSecurityGroup;
