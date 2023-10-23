import { RDSClient, CreateDBInstanceCommand } from '@aws-sdk/client-rds';

async function createPostgresInstance(VpcSecurityGroupIds) {
    const client = new RDSClient({ region: 'us-east-1' });

    const params = {
        AllocatedStorage: 20,
        DBInstanceIdentifier: 'secrets-db5',
        DBInstanceClass: 'db.t3.micro',
        DBName: 'secrets',
        // this is hard-coded but it shouldn't be
        VpcSecurityGroupIds,
        Engine: 'postgres',
        MasterUsername: 'postgres',
        MasterUserPassword: 'password',
        DBSubnetGroupName: 'my-db-subnet-group',
    };

    try {
        const createDBInstanceCommand = new CreateDBInstanceCommand(params);

        const data = await client.send(createDBInstanceCommand);
        console.log('Postgres instance created:', data);
    } catch (error) {
        console.error('Error creating Postgres instance:', error);
    }
}

export default createPostgresInstance;
