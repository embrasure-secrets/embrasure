import { RDSClient, DeleteDBSubnetGroupCommand } from '@aws-sdk/client-rds';

async function deleteRDSSubnetGroup() {
    const client = new RDSClient();
    const subnetGroupName = 'embrasure-db-subnet-group-v2';

    const command = new DeleteDBSubnetGroupCommand({
        DBSubnetGroupName: subnetGroupName,
    });

    try {
        await client.send(command);
        console.log('RDS subnet group deleted successfully.');
    } catch (error) {
        console.error('Error deleting RDS subnet group:', error);
        throw error;
    }
}

export default deleteRDSSubnetGroup;
