import {
    EC2Client,
    CreateInternetGatewayCommand,
    AttachInternetGatewayCommand,
} from '@aws-sdk/client-ec2';
import addNametag from '../utils/addNametag.js';

async function createInternetGateway(VpcId) {
    try {
        // Initialize the EC2 client
        const client = new EC2Client();

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
        console.log('Internet Gateway created');
        // Code below this point is just adding a name to the newly created internet gateway instance
        await addNametag(internetGatewayId, 'Embrasure-IG');
        return internetGatewayId;
    } catch (error) {
        console.error('Error in creating Internet Gateway: ', error.message);
        throw error;
    }
}

export default createInternetGateway;
