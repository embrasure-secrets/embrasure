import { Signer } from '@aws-sdk/rds-signer';
//  https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_rds_signer.html

/* 
Given an AWS accessKeyId, AWS secretAccessKey,
db region, db hostname, db port, and db username
all as strings, generateDBAuthToken will 
generate an IAM Auth token for the current IAM user
to connect to the IAM auth enabled database
*/

async function generateDBAuthToken(
    //remove access key id /secret access key
    // accessKeyId,
    // secretAccessKey,
    region,
    hostname,
    port,
    username
) {
    try {
        const signer = new Signer({
            //AWS credentials of iam user
            // credentials: {
            //   accessKeyId,
            //   secretAccessKey,
            // },
            // region of database e.g. "us-east-1"
            region,
            // db endpoint
            hostname,
            // db port e.g. "5432"
            port,
            // db username associated with iam user e.g. "iamuser"
            username,
        });

        const authToken = await signer.getAuthToken();
        console.log(authToken);
        return authToken;
    } catch (error) {
        console.error('Error in generating token: ', error);
        throw error;
    }
}

// await generateDBAuthToken(
//   "us-east-2",
//   "database-secrets.cvfj3miqpg5n.us-east-2.rds.amazonaws.com",
//   5432,
//   "iamuser"
// );
export default generateDBAuthToken;
