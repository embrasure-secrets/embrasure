import {
    EC2Client,
    CreateRouteTableCommand,
    CreateRouteCommand,
    AssociateRouteTableCommand,
} from '@aws-sdk/client-ec2';
import addNametag from './addNametag.js';

async function createPrivateRouteTable(VpcId, subnetIdArr) {
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
    if (subnetIdArr) {
        subnetIdArr.forEach(async (id) => {
            const associateRouteTableCommand = new AssociateRouteTableCommand({
                RouteTableId: routeTableId,
                SubnetId: id,
            });
            await client.send(associateRouteTableCommand);
        });
    }
    console.log('Route Table created');
    // Code below this point is just adding a name to the newly created VPC
    await addNametag(routeTableId, 'Embrasure-Private-Route-Table-v2');
}

export default createPrivateRouteTable;
