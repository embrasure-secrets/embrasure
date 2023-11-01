import { IAMClient, GetUserCommand } from '@aws-sdk/client-iam';

const iamClient = new IAMClient();

async function getUsername() {
    try {
        const response = await iamClient.send(new GetUserCommand({}));

        if (response.User && response.User.UserName) {
            const username = response.User.UserName;
            return username;
        }
    } catch (error) {
        console.error('Error in getting username', error.message);
        throw error;
    }
}

export default getUsername;
