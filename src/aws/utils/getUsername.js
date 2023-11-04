import { IAMClient, GetUserCommand } from '@aws-sdk/client-iam';

const iamClient = new IAMClient();

async function getUsername() {
    try {
        const { User: user } = await iamClient.send(new GetUserCommand({}));
        if (user && user.UserName) {
            const username = user.UserName;
            return username;
        }
    } catch (error) {
        console.error('Error in getting username', error.message);
        throw error;
    }
}

export default getUsername;
