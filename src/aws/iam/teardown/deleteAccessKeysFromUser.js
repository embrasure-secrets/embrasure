import { IAMClient, ListAccessKeysCommand, DeleteAccessKeyCommand } from '@aws-sdk/client-iam';

const client = new IAMClient();

async function deleteAccessKeysFromUser(username) {
    const listAccessKeysParams = {
        UserName: username,
    };
    const listAccessKeysCommand = new ListAccessKeysCommand(listAccessKeysParams);

    try {
        const { AccessKeyMetadata: AccessKeyMetadataArr } =
            await client.send(listAccessKeysCommand);

        if (AccessKeyMetadataArr && AccessKeyMetadataArr.length > 0) {
            const accessKeyIdsToDelete = AccessKeyMetadataArr.map(({ AccessKeyId }) => AccessKeyId);

            const paramsArr = accessKeyIdsToDelete.map((id) => ({
                UserName: username,
                AccessKeyId: id,
            }));

            const commandsArr = paramsArr.map((param) => {
                return new DeleteAccessKeyCommand(param);
            });

            const sendPromiseArr = commandsArr.map((command) => client.send(command));

            await Promise.all(sendPromiseArr);

            console.log(`Access keys for user "${username}" has been deleted.`);
        } else {
            console.log(`No access keys found for user "${username}".`);
        }
    } catch (error) {
        console.error(`Error listing or deleting access keys: ${error.message}`);
    }
}

export default deleteAccessKeysFromUser;
