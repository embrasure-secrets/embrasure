import { RDSClient, DescribeDBInstancesCommand } from '@aws-sdk/client-rds';

// Specify the identifier of the existing RDS database you want to describe
async function getDbResourceId(dbInstanceIdentifier = 'embrasure-database-v2') {
    try {
        // Initialize the RDS client
        const client = new RDSClient(); // Replace with your desired AWS region

        // Create a DescribeDBInstancesCommand with the specified DB instance identifier
        const describeDBInstanceCommand = new DescribeDBInstancesCommand({
            DBInstanceIdentifier: dbInstanceIdentifier,
        });

        const response = await client.send(describeDBInstanceCommand);
        const resourceId = response.DBInstances[0].DbiResourceId;
        console.log('RDS Database Resource ID:', resourceId);
        return resourceId;
    } catch (error) {
        console.error('Error in getting resource id: ', error);
        throw error;
    }
}

export default getDbResourceId;
