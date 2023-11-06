// Import the necessary modules from the AWS SDK for JavaScript v3
import { RDSClient, DescribeDBInstancesCommand } from '@aws-sdk/client-rds';

/*
Given a AWS rds database identifier as a string,
getDBArnAndEndpoint function will return the 
an object containing the ARN and endpoint of the database
*/

async function getDBArnAndEndpoint(dbInstanceIdentifier = 'embrasure-database-v2') {
    try {
        const rdsClient = new RDSClient();

        const describeDBInstancesCommand = new DescribeDBInstancesCommand({
            DBInstanceIdentifier: dbInstanceIdentifier,
        });

        // Call the send method on the RDSClient instance with the DescribeDBInstancesCommand instance as the input
        const response = await rdsClient.send(describeDBInstancesCommand);

        // Extract the ARN and endpoint from the response object
        const arn = response.DBInstances[0].DBInstanceArn;
        const endpoint = response.DBInstances[0].Endpoint.Address;
        console.log('arn is: ', arn);
        console.log('endpoint is: ', endpoint);
        return { arn, endpoint };
    } catch (error) {
        console.error('Error in getting database ARN and endpoint: ', error);
        throw error;
    }
}

export default getDBArnAndEndpoint;
