const AWS = require('aws-sdk');

// Create the IAM service object
const iam = new AWS.IAM({ apiVersion: '2010-05-08' });

// Pass in a string name and create a new IAM user
function createUser(name) {
    const params = {
        UserName: name,
    };

    iam.createUser(params, function (err, newUser) {
        if (err) {
            console.error(err, err.stack);
        } else {
            // successful response returns object with User property
            console.log('User created: ', newUser);
        }
    });
}

// Pass in a string name and delete IAM user
function removeUser(name) {
    const params = {
        UserName: name,
    };

    iam.deleteUser(params, function (err, response) {
        if (err) {
            console.error(err, err.stack);
        } else {
            // successful deletion of user
            console.log('user deleted: ', response);
        }
    });
}

module.exports = {
    createUser,
    removeUser,
};
