import createVpc from '../../src/aws/vpc/createVpc.js';
import createVpcSecurityGroup from '../../src/aws/vpc/createVpcSecurityGroup.js';
import createPostgresInstance from '../../src/aws/rds/createPostgresInstance.js';
import createSubnets from '../../src/aws/vpc/createDBSubnets.js';
import createSubnetGroup from '../../src/aws/rds/createDBSubnetGroup.js';
import createInternetGateway from '../../src/aws/vpc/createInternetGateway.js';
import createPublicRouteTable from '../../src/aws/vpc/createPublicRouteTable.js';
import createPrivateRouteTable from '../../src/aws/vpc/createPrivateRouteTable.js';
import checkRDSStatus from '../../src/aws/rds/checkRdsStatus.js';
import init from '../../src/aws/init.js';

jest.mock('../../src/aws/vpc/createVpc.js');
jest.mock('../../src/aws/vpc/createVpcSecurityGroup.js');
jest.mock('../../src/aws/vpc/createDBSubnets.js');
jest.mock('../../src/aws/vpc/createInternetGateway.js');
jest.mock('../../src/aws/vpc/createPublicRouteTable.js');
jest.mock('../../src/aws/vpc/createPrivateRouteTable.js');
jest.mock('../../src/aws/rds/createPostgresInstance.js');
jest.mock('../../src/aws/rds/createDBSubnetGroup.js');
jest.mock('../../src/aws/rds/checkRdsStatus.js');

describe('init', () => {
    it('should initialize a new backend successfully', async () => {
        createVpc.mockResolvedValue({ Vpc: { VpcId: 'vpc-id' } });
        createVpcSecurityGroup.mockResolvedValue({
            SecurityGroupRules: [{ GroupId: 'security-group-id' }],
        });
        createPostgresInstance.mockResolvedValue();
        createSubnets.mockResolvedValue(['subnet-1', 'subnet-2']);
        createSubnetGroup.mockResolvedValue();
        createInternetGateway.mockResolvedValue('internet-gateway-id');
        createPublicRouteTable.mockResolvedValue();
        createPrivateRouteTable.mockResolvedValue();
        checkRDSStatus.mockResolvedValue();

        const logSpy = jest.spyOn(console, 'log');
        const errorSpy = jest.spyOn(console, 'error');

        await init();

        expect(createVpc).toHaveBeenCalled();
        expect(createVpcSecurityGroup).toHaveBeenCalledWith('vpc-id');
        expect(createPostgresInstance).toHaveBeenCalledWith(['security-group-id']);
        expect(createSubnets).toHaveBeenCalledWith('vpc-id');
        expect(createSubnetGroup).toHaveBeenCalledWith(['subnet-1', 'subnet-2']);
        expect(createInternetGateway).toHaveBeenCalledWith('vpc-id');
        expect(createPublicRouteTable).toHaveBeenCalledWith('vpc-id', 'internet-gateway-id');
        expect(createPrivateRouteTable).toHaveBeenCalledWith('vpc-id', ['subnet-1', 'subnet-2']);
        expect(checkRDSStatus).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledWith('DB instance is available');
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
        const error = new Error('Connection refused.');
        createVpc.mockRejectedValue(error);

        const logSpy = jest.spyOn(console, 'log');
        const errorSpy = jest.spyOn(console, 'error');

        try {
            await init;
        } catch (err) {
            expect(err.message).toBe('Connection refused.');
        }

        expect(logSpy).not.toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledWith(error);
    });
});
