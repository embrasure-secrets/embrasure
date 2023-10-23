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
createRouteTable('vpc-05a929e4e88bc8464', 'igw-0561b93c4265ce36b', [
    'subnet-01a068c17708053f0',
    'subnet-0a13562d00e637acd',
]);
export default createRouteTable;
