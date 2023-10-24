import { RDSClient, CreateDBInstanceCommand, ModifyDBInstanceCommand } from '@aws-sdk/client-rds';

async function createPostgresInstance(VpcSecurityGroupIds) {
    const client = new RDSClient({ region: 'us-east-1' });

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
        const createDBInstanceCommand = new CreateDBInstanceCommand(params);

        const data = await client.send(createDBInstanceCommand);
        console.log('Postgres instance created:', data);
        // console.log('db ID: ', data.DBInstance.DbiResourceId);

        // const modifyDBInstanceCommand = new ModifyDBInstanceCommand({
        //     DBInstanceIdentifier: data.DBInstance.DbiResourceId,
        //     PubliclyAccessible: true,
        // });

        // await client.send(modifyDBInstanceCommand);
        // console.log('database set to publicly accessible');
    } catch (error) {
        console.error('Error creating Postgres instance:', error);
    }
}

export default createPostgresInstance;
