import { RDSClient, CreateDBSubnetGroupCommand } from '@aws-sdk/client-rds';

async function createSubnetGroup(subnetIdArr) {
    // Initialize the RDS client
    const client = new RDSClient({ region: 'us-east-1' }); // Replace with your desired AWS region

    // Specify the parameters for creating the DB subnet group
    const subnetGroupParams = {
        DBSubnetGroupName: 'embrasure-db-subnet-group-v2',
        DBSubnetGroupDescription: 'Embrasure created subnet group',
        SubnetIds: subnetIdArr, // Replace with your subnet IDs
    };

    // Create a new DB subnet group using CreateDBSubnetGroupCommand
    const createSubnetGroupCommand = new CreateDBSubnetGroupCommand(subnetGroupParams);

    client
        .send(createSubnetGroupCommand)
        .then((data) => {
            console.log('Created DB subnet group with name:', data.DBSubnetGroup.DBSubnetGroupName);
        })
        .catch((error) => {
            console.error('Error creating DB subnet group:', error);
        });
}

export default createSubnetGroup;
