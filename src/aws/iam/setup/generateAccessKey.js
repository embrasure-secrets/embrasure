import { CreateAccessKeyCommand, IAMClient } from '@aws-sdk/client-iam';

async function generateAccessKeys(IAMUserName) {
    try {
        const client = new IAMClient();
        const command = new CreateAccessKeyCommand({ UserName: IAMUserName });
        const generateKeysResponse = await client.send(command);
        console.log(`Access keys for ${IAMUserName} successfully created: `);
        console.log(generateKeysResponse);
        const accessKey = generateKeysResponse.AccessKey.AccessKeyId;
        const secretAccessKey = generateKeysResponse.AccessKey.SecretAccessKey;
        // const accessKeyId = response.AccessKey.AccessKeyId;
        // const secretAccessKey = response.AccessKey.SecretAccessKey;
        /*
      Access keys successfully created:  
      {
        '$metadata': {
          httpStatusCode: 200,
          requestId: '2446ebfc-7193-465c-a9f0-35fff1a3d3fa',
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        AccessKey: {
          UserName: 'new-user-bob5',
          AccessKeyId: 'AKIAU2DB5OBTQ3OFYWAC',
          Status: 'Active',
          SecretAccessKey: '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',
          CreateDate: 2023-10-25T23:16:20.000Z
        }
      }
    */
        // return generateKeysResponse;
        return { accessKey, secretAccessKey };
    } catch (error) {
        console.error('Error in generating keys: ', error);
        throw error;
    }
}

export default generateAccessKeys;
