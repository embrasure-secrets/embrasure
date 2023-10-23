import { RDSClient, CreateDBSubnetGroupCommand } from '@aws-sdk/client-rds';

async function createSubnetGroup(subnetIdArr) {
    // Initialize the RDS client
    const rdsClient = new RDSClient({ region: 'us-east-1' }); // Replace with your desired AWS region

    // Specify the parameters for creating the DB subnet group
    const subnetGroupParams = {
        DBSubnetGroupName: 'my-db-subnet-group', // Replace with the desired name for your subnet group
        DBSubnetGroupDescription: 'My DB Subnet Group Description', // Replace with the description
        SubnetIds: subnetIdArr, // Replace with your subnet IDs
    };

    // Create a new DB subnet group using CreateDBSubnetGroupCommand
    const createSubnetGroupCommand = new CreateDBSubnetGroupCommand(subnetGroupParams);

    rdsClient
        .send(createSubnetGroupCommand)
        .then((data) => {
            console.log('Created DB subnet group with name:', data.DBSubnetGroup.DBSubnetGroupName);
        })
        .catch((error) => {
            console.error('Error creating DB subnet group:', error);
        });
}

export default createSubnetGroup;
