import { IAMClient, GetUserCommand } from '@aws-sdk/client-iam';

const iamClient = new IAMClient();

async function getUserArn() {
    try {
        const { User: user } = await iamClient.send(new GetUserCommand({}));
        if (user && user.Arn) {
            const { Arn: arn } = user;
            return arn;
        }
    } catch (error) {
        console.error('Error in getting username', error.message);
        throw error;
    }
}

export default getUserArn;
