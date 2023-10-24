import { RDSClient, CreateDBInstanceCommand } from '@aws-sdk/client-rds';

async function createPostgresInstance(VpcSecurityGroupIds) {
    // Initialize the RDS client
    const client = new RDSClient({ region: 'us-east-1' });

    // Specify parameters of database instance
    const params = {
        AllocatedStorage: 20,
        DBInstanceIdentifier: 'embrasure-database',
        DBInstanceClass: 'db.t3.micro',
        DBName: 'secrets',
        VpcSecurityGroupIds,
        Engine: 'postgres',
        MasterUsername: 'postgres',
        MasterUserPassword: 'password',
        DBSubnetGroupName: 'embrasure-db-subnet-group',
        PubliclyAccessible: true,
    };

    try {
        // Send request to build database
        const createDBInstanceCommand = new CreateDBInstanceCommand(params);

        const data = await client.send(createDBInstanceCommand);
        console.log('Postgres instance created:', data);
    } catch (error) {
        console.error('Error creating Postgres instance:', error);
    }
}

export default createPostgresInstance;
