import {
    EC2Client,
    CreateVpcCommand,
    ModifyVpcAttributeCommand,
    CreateTagsCommand,
} from '@aws-sdk/client-ec2';

async function createVpc() {
    const client = new EC2Client({ region: 'us-east-1' });

    const createVpcCommand = new CreateVpcCommand({ CidrBlock: '10.0.0.0/16' });
    const response = await client.send(createVpcCommand);

    // Code below this point is just adding a name to the newly created VPC
    const tagsParams = {
        Resources: [response.Vpc.VpcId],
        Tags: [
            {
                Key: 'Name',
                Value: 'Embrasure-VPC-v2',
            },
        ],
    };

    const createTagsCommand = new CreateTagsCommand(tagsParams);
    await client.send(createTagsCommand);

    const vpcModifyInput1 = {
        VpcId: response.Vpc.VpcId,
        EnableDnsHostnames: { Value: true },
    };
    const vpcModifyInput2 = {
        VpcId: response.Vpc.VpcId,
        EnableDnsSupport: { Value: true },
    };
    const command1 = new ModifyVpcAttributeCommand(vpcModifyInput1);
    await client.send(command1);

    const command2 = new ModifyVpcAttributeCommand(vpcModifyInput2);
    await client.send(command2);
    return response;
}

export default createVpc;
