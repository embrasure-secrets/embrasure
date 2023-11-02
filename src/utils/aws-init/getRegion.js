import { IAMClient } from '@aws-sdk/client-iam';

const iamClient = new IAMClient();

async function getRegion() {
    try {
        const region = await iamClient.config.region();
        return region;
    } catch (error) {
        console.error('Error in getting region', error.message);
        throw error;
    }
}

export default getRegion;
