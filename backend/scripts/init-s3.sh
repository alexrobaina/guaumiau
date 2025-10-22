#!/bin/bash

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
until curl -s http://localhost:4566/_localstack/health | grep -q '"s3": "running"'; do
  echo "LocalStack S3 not ready yet, waiting..."
  sleep 2
done

echo "LocalStack is ready!"

# Create S3 bucket
echo "Creating S3 bucket: guaumiau-bucket"
aws --endpoint-url=http://localhost:4566 s3 mb s3://guaumiau-bucket --region us-east-1

# List buckets to confirm
echo "Available S3 buckets:"
aws --endpoint-url=http://localhost:4566 s3 ls

echo "S3 bucket initialization complete!"
