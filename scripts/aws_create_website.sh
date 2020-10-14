#!/bin/sh
###
# A shell script to create a static website in AWS
# Author: Teki Chan<tekichan@gmail.com>
###

# Check Arguments: Stack Name, User Profile, Bucket Name, Region Code
if [ "$#" -ne 4 ]; then
  echo "Usage: $0 STACK_NAME USER_PROFILE BUCKET_NAME REGION_CODE" >&2
  echo "Example: $0 my-stack my-profile my-bucket ap-southeast-1" >&2
  exit 1
fi

# Check CloudFormation Script exists
CF_YAML='./scripts/aws_cf_s3_create_website.yaml'
if ! [ -e "$CF_YAML" ]; then
  echo "$CF_YAML not found. Please run in the correct path." >&2
  exit 1
fi

# Check Website Build exists
WS_BUILD='./build/'
if ! [ -d "$WS_BUILD" ]; then
  echo "$WS_BUILD is not valid. Please build the production first." >&2
  exit 1
fi

### Set variables
# STACK NAME: The stack name of this CloudFormation Stack
# USER PROFILE: The profile name to run this command locally
# BUCKET NAME: The S3 bucket to store the website content
# REGION CODE: The region code of the S3 Bucket. The region should have been configured in the profile used above.
STACK_NAME=$1
USER_PROFILE=$2
BUCKET_NAME=$3
REGION_CODE=$4

# Create CloudFormation Stack to create S3 Bucket
aws cloudformation create-stack --stack-name $STACK_NAME --profile $USER_PROFILE --template-body file://$CF_YAML --parameters ParameterKey=BucketNameParam,ParameterValue=$BUCKET_NAME ParameterKey=RegionCodeParam,ParameterValue=$REGION_CODE

# Check CloudFormation Stack

# Upload website files to the S3 Bucket
aws s3 cp $WS_BUILD s3://$BUCKET_NAME/ --recursive --profile $USER_PROFILE

