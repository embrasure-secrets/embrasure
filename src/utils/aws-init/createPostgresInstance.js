import { RDSClient, CreateDBInstanceCommand } from '@aws-sdk/client-rds';

async function createPostgresInstance(VpcSecurityGroupIds) {
    // Initialize the RDS client
    const client = new RDSClient();

    // Specify parameters of database instance
    const params = {
        AllocatedStorage: 20,
        DBInstanceIdentifier: 'embrasure-database-v2',
        DBInstanceClass: 'db.t3.micro',
        DBName: 'secrets',
        VpcSecurityGroupIds,
        Engine: 'postgres',
        MasterUsername: 'postgres',
        MasterUserPassword: 'password',
        DBSubnetGroupName: 'embrasure-db-subnet-group-v2',
        PubliclyAccessible: true,
        StorageEncrypted: true,
        EnableIAMDatabaseAuthentication: true,
    };

    try {
        // Send request to build database
        const createDBInstanceCommand = new CreateDBInstanceCommand(params);

        const data = await client.send(createDBInstanceCommand);
        console.log(
            'Postgres instance creation has begun! Note: it can take up to 10 minutes for the database to be ready for use'
        );
    } catch (error) {
        console.error('Error creating Postgres instance:', error);
    }
}

export default createPostgresInstance;
