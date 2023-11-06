import { EC2Client, CreateTagsCommand } from '@aws-sdk/client-ec2';

async function addNametag(resourceId, resourceName) {
    try {
        const client = new EC2Client();
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
    } catch (error) {
        console.error(`Error in adding a new nametag to resource: ${resourceName}`, error.message);
        throw error;
    }
}

export default addNametag;
