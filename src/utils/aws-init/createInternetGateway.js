import {
    EC2Client,
    CreateInternetGatewayCommand,
    AttachInternetGatewayCommand,
    CreateTagsCommand,
} from '@aws-sdk/client-ec2';

async function createInternetGateway(VpcId) {
    const Client = new EC2Client({ region: 'us-east-1' });
    const createInternetGatewayCommand = new CreateInternetGatewayCommand({});
    const createInternetGatewayResponse = await Client.send(createInternetGatewayCommand);
    const internetGatewayId = createInternetGatewayResponse.InternetGateway.InternetGatewayId;

    const attachInternetGatewayCommand = new AttachInternetGatewayCommand({
        InternetGatewayId: internetGatewayId,
        VpcId,
    });
    await Client.send(attachInternetGatewayCommand);

    // Code below this point is just adding a name to the newly created internet gateway instance
    const tagsParams = {
        Resources: [internetGatewayId],
        Tags: [
            {
                Key: 'Name',
                Value: 'Embrasure-IG',
            },
        ],
    };

    const createTagsCommand = new CreateTagsCommand(tagsParams);
    await Client.send(createTagsCommand);
    return internetGatewayId;
}

export default createInternetGateway;
