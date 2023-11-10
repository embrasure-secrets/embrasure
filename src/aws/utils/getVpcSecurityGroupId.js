import { EC2Client, DescribeSecurityGroupsCommand } from '@aws-sdk/client-ec2';

async function getVpcSecurityGroupId(vpcId) {
    // Set up the EC2 client
    const client = new EC2Client(); // Replace 'your-region' with your AWS region

    // Create the DescribeSecurityGroupsCommand
    const describeSecurityGroupsCommand = new DescribeSecurityGroupsCommand({
        Filters: [
            {
                Name: 'vpc-id',
                Values: [vpcId],
            },
        ],
    });

    // Call the EC2 client to describe security groups
    try {
        const response = await client.send(describeSecurityGroupsCommand);
        const securityGroups = response.SecurityGroups;
        let securityGroupIds;

        if (securityGroups.length > 0) {
            // Filter out default security group then extract security group ID from remaining embrasure security group
            securityGroupIds = securityGroups
                .filter((sg) => sg.GroupName === 'Embrasure-PostgreSQL-Traffic-Only')
                .map((sg) => sg.GroupId);
            console.log('Security Group IDs:', securityGroupIds);
        } else {
            console.log('No security groups found for the specified VPC.');
        }
        return securityGroupIds;
    } catch (error) {
        console.error('Error describing security groups:', error);
        throw error;
    }
}

export default getVpcSecurityGroupId;
