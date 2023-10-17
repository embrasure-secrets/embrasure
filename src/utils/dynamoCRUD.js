const AWS = require('aws-sdk');

function addSecret(dbName, dbRegion, secretObj) {
    const ddb = new AWS.DynamoDB({ region: dbRegion, apiVersion: '2012-08-10' });
    const params = {
        TableName: dbName,
        ...secretObj,
    };

    ddb.putItem(params, (err, data) => {
        if (err) {
            console.log('Error \n\n', err);
        } else {
            console.log('Success \n\n', data);
        }
    });
}

function readSecret(dbName, dbRegion, partitionKeyValue, partitionKeyDataType) {
    const ddb = new AWS.DynamoDB({ region: dbRegion, apiVersion: '2012-08-10' });
    const partitionArgument = {};
    partitionArgument[partitionKeyDataType] = String(partitionKeyValue);

    const params = {
        TableName: dbName,
        Key: {
            secret_name: partitionArgument,
        },
    };
    ddb.getItem(params, (err, data) => {
        if (err) {
            return err;
        }
        return data.Item;
    });
}

function deleteSecret(dbName, dbRegion, partitionKeyValue, partitionKeyDataType) {
    const ddb = new AWS.DynamoDB({ region: dbRegion, apiVersion: '2012-08-10' });
    const partitionArgument = {};
    partitionArgument[partitionKeyDataType] = String(partitionKeyValue);

    const params = {
        TableName: dbName,
        Key: {
            secret_name: partitionArgument,
        },
    };
    ddb.deleteItem(params, (err, data) => {
        if (err) {
            console.log('Error', err);
        } else {
            console.log('Success', data.Item);
        }
    });
}

module.exports = {
    addSecret,
    readSecret,
    deleteSecret,
};
