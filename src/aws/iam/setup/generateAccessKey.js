import { CreateAccessKeyCommand, IAMClient } from '@aws-sdk/client-iam';

async function generateAccessKeys(IAMUserName) {
    try {
        const client = new IAMClient();
        const command = new CreateAccessKeyCommand({ UserName: IAMUserName });
        const generateKeysResponse = await client.send(command);
        console.log(`Access keys for ${IAMUserName} successfully created.`);
        const accessKey = generateKeysResponse.AccessKey.AccessKeyId;
        const secretAccessKey = generateKeysResponse.AccessKey.SecretAccessKey;

        return { accessKey, secretAccessKey };
    } catch (error) {
        console.error('Error in generating keys: ', error);
        throw error;
    }
}

export default generateAccessKeys;
