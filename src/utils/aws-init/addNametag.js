import { EC2Client, CreateTagsCommand } from '@aws-sdk/client-ec2';

async function addNametag(resourceId, resourceName) {
    const client = new EC2Client({ region: 'us-east-1' });
    const createTagsCommand = new CreateTagsCommand({
        Resources: [resourceId],
        Tags: [
            {
                Key: 'Name',
                Value: resourceName,
            },
        ],
    });

    await client.send(createTagsCommand);
}

export default addNametag;
