# Catalog Example

This repository is an example how AWS S3 and Azure Storage provide static website hosting service. You could follow the listed steps to host the example website in AWS and Azure respectively.
[![License](https://img.shields.io/badge/license-MIT-green.svg)](/LICENSE)

*The example website is a product catalog built by React JS. The detail will not be covered here. Setups of domain name, DNS and secure connection (https) are out of scope in this document.*

The website files are located in **build** folder. The setup scripts are located in **scripts** folder.

## AWS S3

*Before you start, create an IAM user credentials with sufficient priviledges to execute `aws` CLI.*

1. Create CloudFormation Stack to create S3 Bucket
```Bash
aws cloudformation create-stack --stack-name <STACK NAME> --profile <USER PROFILE>  --template-body file://./scripts/aws_cf_s3_create_website.yaml --parameters ParameterKey=BucketNameParam,ParameterValue=<BUCKET NAME> ParameterKey=RegionCodeParam,ParameterValue=<REGION CODE>
```
- \<STACK NAME\>: The stack name of this CloudFormation Stack
- \<USER PROFILE\>: The profile name to run this command locally
- \<BUCKET NAME\>: The S3 bucket to store the website content
- \<REGION CODE\>: The region code of the S3 Bucket. The region should have been configured in the profile used above.

2. Upload website files to the S3 Bucket
```Bash
aws s3 cp ./build/ s3://<BUCKET NAME>/ --recursive --profile <USER PROFILE>
```

3. Browse the assigned domain name from CloudFront
```Bash
aws cloudfront list-distributions --query "DistributionList.Items[].DomainName" --profile <USER PROFILE>
```

4. Browse the website.
The URL of the website is in format of https://<DOMAIN PREFIX>.cloudfront.net
- \<DOMAIN PREFIX\>: CloudFront Domain Prefix which is assigned by CloudFront automatically.

## Azure Storage

*Before you start, create a principal with sufficient priviledges to execute `az` CLI. `az login` should have been executed successfully*

1. Create Resource Group
```Bash
az group create --location <LOCATION NAME> --name <RESOURCE GROUP>
```
- \<LOCATION NAME\>: Location Name in Azure. It can be viewed from a list of the command `az account list-locations`.
- \<RESOURCE GROUP\>: A name of the resource group we are creating to put all related resources together.

2. Create Storage Account
```Bash
az storage account create --name <STORAGE ACCOUNT> --resource-group <RESOURCE GROUP> --location <LOCATION NAME> --sku Standard_LRS
```
- \<STORAGE ACCOUNT\>: Storage Account Name to be created

3. Create $web Blob Container
```Bash
az storage container create --account-name <STORAGE ACCOUNT> --name '$web' 
```

4. Enable Website Hosting in Blob Storage
```Bash
az storage blob service-properties update --account-name <STORAGE ACCOUNT> --static-website --404-document error.html --index-document index.html
```

5. Upload website files to the $web Blob Container
```Bash
az storage blob upload-batch --account-name <STORAGE ACCOUNT> --source ./build/ --destination '$web'
```

6. Create CDN Profile
```Bash
az cdn profile create --name <CDN Profile> --resource-group <RESOURCE GROUP> --sku Standard_Microsoft
```
- \<CDN Profile\>: Name of CDN Profile

7. Create CDN Endpoint
```Bash
az cdn endpoint create --name <CDN Profile> --resource-group <RESOURCE GROUP> --profile-name <CDN Profile> --origin <HOSTING HOST> --origin-host-header catalogegsite.z23.web.core.windows.net --enable-compression
```
- \<CDN Endpoint\>: Name of CDN Endpoint
- \<HOSTING HOST\>: Host of Storage Website Hosting. It can be retrieved by `az storage account show --name <STORAGE ACCOUNT> --resource-group <RESOURCE GROUP> --query "primaryEndpoints.web" --output json`

8. Redirect HTTP requests to HTTPS
```Bash
az cdn endpoint rule add --name <CDN Endpoint> --resource-group <RESOURCE GROUP> --profile-name <CDN Profile> --rule-name enforcehttps --order 1 --action-name "UrlRedirect"  --redirect-type Found --redirect-protocol HTTPS --match-variable RequestScheme --operator Equal --match-value HTTP
```

9. Browse the website.
The URL of the website is in format of https://\<CDN Endpoint\>.azureedge.net

## Appendix A - How to build
- Build React JS Frontend: `npm run build`

## Appendix B - References
- Acknowledgement of React JS design from [Material UI template](https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/album/Album.js)
- [Creating an Amazon S3 bucket for website hosting and with a DeletionPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-s3.html#scenario-s3-bucket-website)

## Authors
- Teki Chan *tekichan@gmail.com*