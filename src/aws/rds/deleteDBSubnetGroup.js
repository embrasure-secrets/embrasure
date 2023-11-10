import { RDSClient, DeleteDBSubnetGroupCommand } from '@aws-sdk/client-rds';

async function deleteRDSSubnetGroup() {
    const client = new RDSClient();
    const subnetGroupName = 'embrasure-db-subnet-group-v2';

    const command = new DeleteDBSubnetGroupCommand({
        DBSubnetGroupName: subnetGroupName,
    });

    try {
        const response = await client.send(command);
        console.log('RDS subnet group deleted successfully:', response);
    } catch (error) {
        console.error('Error deleting RDS subnet group:', error);
    }
}

export default deleteRDSSubnetGroup;
