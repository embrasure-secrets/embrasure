import getDbResourceId from './getDbResourceId.js';
import getDBArnAndEndpoint from './getDBArnAndEndpoint.js';

async function getFormattedResourceArn(
    dbInstanceIdentifier = 'embrasure-database-v2',
    iamUsername
) {
    let dbResourceId = await getDbResourceId(dbInstanceIdentifier); // resource id: db-FLUNOUH3GX4XZK4QW7UO6FI2VQ
    let { arn } = await getDBArnAndEndpoint(dbInstanceIdentifier); // VALUE RETURNED FROM DATABASE ARN = arn:aws:rds:us-east-1:652348555870:db:embrasure-database-v2

    const arnPieces = arn.split(':');

    const region = arnPieces[3];
    const accountID = arnPieces[4];

    const formattedResourceArn = `arn:aws:rds-db:${region}:${accountID}:dbuser:${dbResourceId}/${iamUsername}`;
    return formattedResourceArn;
}

export default getFormattedResourceArn;
