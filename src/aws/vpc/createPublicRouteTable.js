import {
    EC2Client,
    CreateRouteTableCommand,
    CreateRouteCommand,
    AssociateRouteTableCommand,
} from '@aws-sdk/client-ec2';
import addNametag from '../utils/addNametag.js';

async function createPublicRouteTable(VpcId, gatewayId, subnetIdArr) {
    // Initialize the EC2 client
    const client = new EC2Client();

    // Create Route Table and specify parameters of new route table at the same time
    const createRouteTableCommand = new CreateRouteTableCommand({
        VpcId,
        Main: true,
    });

    // Send request to initialize new route table
    const createRouteTableResponse = await client.send(createRouteTableCommand);
    const routeTableId = createRouteTableResponse.RouteTable.RouteTableId;

    // adds each specified subnet to the route tables logs
    // only runs code if subnetIdArr is not empty
    if (subnetIdArr) {
        subnetIdArr.forEach(async (id) => {
            const associateRouteTableCommand = new AssociateRouteTableCommand({
                RouteTableId: routeTableId,
                SubnetId: id,
            });
            await client.send(associateRouteTableCommand);
        });
    }
    // adds the specified internet gateway to the route tables logs
    const createRouteCommand = new CreateRouteCommand({
        DestinationCidrBlock: '0.0.0.0/0',
        GatewayId: gatewayId,
        RouteTableId: routeTableId,
    });
    await client.send(createRouteCommand);
    console.log('Route Table created');
    // Code below this point is just adding a name to the newly created VPC
    await addNametag(routeTableId, 'Embrasure-Public-Route-Table-v2');
}

export default createPublicRouteTable;
