import {
    EC2Client,
    CreateVpcCommand,
    ModifyVpcAttributeCommand,
    CreateTagsCommand,
} from '@aws-sdk/client-ec2';

async function createVpc() {
    // Initialize the EC2 client
    const client = new EC2Client({ region: 'us-east-1' });

    // Create VPC and specify IPv4 CIDR addresses contained by VPC then send request to aws to initialize it
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

    // Code below this point is updating DnsHostnames and DnsSupport properties to true and sending request to aws
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
