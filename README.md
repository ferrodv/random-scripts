# random-scripts
Weird Scripts for Specific Uses

## Default Plugins

- serverless-offline
- serverless-dotenv-plugin
- serverless-webpack

## Dependencies

- Node 18.0.0
- Yarn 1.22.19

## Usage

```bash
# Install dependencies
yarn install

# Run Locally
yarn start
```

### Deployment

In order to deploy the example, you need to run the following command:

```
$ yarn deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-project-dev (112s)

functions:
  hello: aws-node-project-dev-hello (1.5 kB)
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
serverless invoke --function Sync
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Ok\" \n}"
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
NODE_ENV=dev FUNCTIONSFILE=local serverless invoke local --function HealthCheck
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Ok\" \n}"
}
```
