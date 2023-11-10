import { RDSClient, DescribeDBInstancesCommand } from '@aws-sdk/client-rds';

// Set the AWS region and credentials
const client = new RDSClient();

// Set the parameters for the RDS instance
const describeParams = {
    DBInstanceIdentifier: 'embrasure-database-v2',
};

// Check the status of the RDS instance every 10 seconds
const waitForRdsSpinDown = () => {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(async () => {
            try {
                // Describe the RDS instance
                const describeCommand = new DescribeDBInstancesCommand(describeParams);
                const describeData = await client.send(describeCommand);
                const dbStatus = describeData.DBInstances[0].DBInstanceStatus;
                console.log(`Waiting on DB to spin down. Current DB instance status: ${dbStatus}`);

                // If the RDS instance is available, stop checking the status and resolve the promise
                // This block never is triggered. When db is done deleting the next poll will return
                // Error: DB instance not found
                if (dbStatus !== 'deleting') {
                    clearInterval(intervalId);
                    resolve();
                }
            } catch (error) {
                // When an error finally occurs, that means the db no longer exists
                clearInterval(intervalId);
                console.log('Database successfully deleted!');
                resolve();
            }
        }, 10000);
    });
};

export default waitForRdsSpinDown;
