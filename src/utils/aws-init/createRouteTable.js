import {
    EC2Client,
    CreateRouteTableCommand,
    CreateRouteCommand,
    AssociateRouteTableCommand,
    CreateTagsCommand,
} from '@aws-sdk/client-ec2';

async function createRouteTable(VpcId, gatewayId, subnetIdArr) {
    const client = new EC2Client({ region: 'us-east-1' });
    const createRouteTableCommand = new CreateRouteTableCommand({
        VpcId,
        Main: true,
    });

    const createRouteTableResponse = await client.send(createRouteTableCommand);
    const routeTableId = createRouteTableResponse.RouteTable.RouteTableId;

    // adds each specified subnet to the route tables logs
    subnetIdArr.forEach(async (id) => {
        const associateRouteTableCommand = new AssociateRouteTableCommand({
            RouteTableId: routeTableId,
            SubnetId: id,
        });
        await client.send(associateRouteTableCommand);
    });

    // adds the specified internet gateway to the route tables logs
    const createRouteCommand = new CreateRouteCommand({
        DestinationCidrBlock: '0.0.0.0/0',
        GatewayId: gatewayId,
        RouteTableId: routeTableId,
    });
    await client.send(createRouteCommand);

    // Code below this point is just adding a name to the newly created VPC
    const tagsParams = {
        Resources: [routeTableId],
        Tags: [
            {
                Key: 'Name',
                Value: 'Embrasure-Route-Table',
            },
        ],
    };

    const createTagsCommand = new CreateTagsCommand(tagsParams);
    await client.send(createTagsCommand);
}

export default createRouteTable;
