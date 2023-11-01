import { CreateUserCommand, IAMClient } from '@aws-sdk/client-iam';

async function createIAMUser(name) {
    try {
        const client = new IAMClient();
        const command = new CreateUserCommand({ UserName: name });
        const createUserResponse = await client.send(command);
        console.log('User successfully created: ', createUserResponse.User.UserName);
        return createUserResponse;
    } catch (err) {
        console.error('Error in creating new user: ', err);
    }
}

export default createIAMUser;
