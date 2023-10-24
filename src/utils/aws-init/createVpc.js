import { EC2Client, CreateVpcCommand, ModifyVpcAttributeCommand } from '@aws-sdk/client-ec2';
import addNametag from './addNametag';

async function createVpc() {
    // Initialize the EC2 client
    const client = new EC2Client({ region: 'us-east-1' });

    // Create VPC and specify IPv4 CIDR addresses contained by VPC then send request to aws to initialize it
    const createVpcCommand = new CreateVpcCommand({ CidrBlock: '10.0.0.0/16' });
    const response = await client.send(createVpcCommand);
    const vpcId = response.Vpc.VpcId;

    // Function call to add a name to newly constructed VPC
    addNametag(vpcId, 'Embrasure-VPC-v2');

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
