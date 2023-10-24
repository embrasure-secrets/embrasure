import {
    EC2Client,
    CreateInternetGatewayCommand,
    AttachInternetGatewayCommand,
} from '@aws-sdk/client-ec2';
import addNametag from './addNametag.js';

async function createInternetGateway(VpcId) {
    // Initialize the EC2 client
    const client = new EC2Client({ region: 'us-east-1' });

    // Build aws internet gateway object and then send request for creation to aws
    const createInternetGatewayCommand = new CreateInternetGatewayCommand({});
    const createInternetGatewayResponse = await client.send(createInternetGatewayCommand);
    const internetGatewayId = createInternetGatewayResponse.InternetGateway.InternetGatewayId;

    // Send command to attach internet gateway to a specific Vpc (essentially command IG to get to work)
    const attachInternetGatewayCommand = new AttachInternetGatewayCommand({
        InternetGatewayId: internetGatewayId,
        VpcId,
    });
    await client.send(attachInternetGatewayCommand);

    // Code below this point is just adding a name to the newly created internet gateway instance
    await addNametag(internetGatewayId, 'Embrasure-IG');
    return internetGatewayId;
}

export default createInternetGateway;
