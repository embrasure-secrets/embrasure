import {
    EC2Client,
    CreateVpcCommand,
    CreateSubnetCommand,
    CreateTagsCommand,
} from '@aws-sdk/client-ec2';

async function createVpc() {
    const ec2Client = new EC2Client({ region: 'us-east-1' });

    const createVpcCommand = new CreateVpcCommand({ CidrBlock: '10.0.0.0/16' });
    const response = await ec2Client.send(createVpcCommand);

    // Lines 15 - 26 are just adding a name to the newly created VPC
    const tagsParams = {
        Resources: [response.Vpc.VpcId],
        Tags: [
            {
                Key: 'Name',
                Value: 'Test', // Replace with the desired name for your VPC
            },
        ],
    };

    const createTagsCommand = new CreateTagsCommand(tagsParams);
    await ec2Client.send(createTagsCommand);
    return response;
}

export default createVpc;
