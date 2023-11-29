# Embrasure

Embrasure is a lightweight, open source tool for managing application secrets across a small development team.
Embrasure is fully built in AWS in the free tier and builds all of its own architecture so as to not affect any existing aws resources a user may or may not have. Embrasure works as a wrapper that wraps your project, aquires all secrets your project uses, and then runs your project with the necessary secrets injected into their desired location. This eliminates hard coding sensitive information into your codebase and also acts as a single secrets repository to prevent secret sprawl in your teams project environment.

Embrasure encrypts secrets at rest in the secrets database and also utilizes TLS/HTTPS to encrypt your secrets while pulling them down from their cloud storage database to keep your teams secrets a secret. Embrasure also verifies the identity of all users attempting to work with embrasure to determine if they have access before sending any information anywhere. This is all done using aws's high quality security tools along with aws IAM to verify the identity of anyone trying to access your secrets. All this is to say that if you trust amazon to keep your sensitive information secure, then you can trust Embrasure as well!

## Installation

### Pre Embrasure download setup

If you regularly use AWS you may already have the following but embrasure relies on the .aws folder to determine what aws account is being used. This folder must be created in your machines home directory, NOT YOUR PROJECT HOME DIRECTORY. If your not sure what your machines home directory is, run the following script in your terminal:

```bash
cd ~
pwd
```

Create a folder called ".aws" in your home directory and create 2 files: "credentials" and "config" (note that files have no file extension and are all lowercase). Please fill both files with your aws account information as shown below:

NOTE: THE TEAM ADMIN WILL PROVIDE THE AWS_ACCESS_KEY_ID AND AWS_SECRET_ACCESS_KEY TO THEIR TEAMMATES DURING THE SETUP OF EMBRASURE. TEAMMATES SHOULD NOT USE THEIR AWS ACCOUNT CREDENTIALS IF THEY HAVE THEM!
credentials (do not use quotation marks):
[default]
aws_access_key_id = your_aws_access_key_id_here
aws_secret_access_key = your_aws_secret_access_key_here

config:
[default]
region=your_aws_region (ex: region=us-east-1)
output=json

Now you are all set up to install embrasure!

### Embrasure download setup

The following setup is specifically for the team leader/admin! If you are not the team leader, please go to the Embrasure User Repo and follow the installation steps there instead!

Run the following commands in the root directory of the project you wish to use Embrasure Secrets for. They will build all of the aws resources embrasure requires to work in the aws account you have in your ".aws/credentials" file and account you have chosen (if you have multiple accounts in the credentials file) when the commands are run.

```bash
npm install embrasure // install dependencies into your project
npm link // enables embrasure's CLI Commands in your dev environment
embrasure/src/utils/aws-init/init.js // builds aws architecture for secure secrets storage

// GO TO EMBRASURE SERVERLESS REPO TO FINISH EMBRASURE PROJECT SETUP
```

### What did Embrasure just create in my aws account?

Embrasure fully builds all of the aws dependencies it requires to work and makes no assumptions regarding what resources are available to connect to in the admins aws account. Because of this, the following aws resources are built:

x1 VPC (virtual private cloud)
x3 Subnets
x2 Route Tables
x1 VPC Security Group
x1 Internet Gateway
x1 Subnet Group
x1 RDS Database running PostgreSQL
x1 Lambda (built from setup in "Embrasure Serverless" Repo)
x1 API Gateway (built from setup in "Embrasure Serverless" Repo)

## Usage

Usage is dependent on what accessibility is granted to a user by the admin but all embrasure commands are listed below:

```node
// Secrets database interaction commands
embrasure getAllSecrets // returns all secrets a user has access to in a development environment
embrasure getSecret --name <secretName> // returns the value of a specified secret if user has access to that secret
embrasure addSecret --name <name> --value <value> // adds a secret to the secrets manager if user has create secret access
embrasure updateSecret --name <name> --value <value> // updates the value of a specified secret if user has update secret access
embrasure deleteSecret --name <name> // deletes a specified secret from the secrets manager is user has delete secret access

// Admin only user interaction commands
embrasure createUser
embrasure addPermission
embrasure removeUser
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License .

[MIT](https://choosealicense.com/licenses/mit/)
