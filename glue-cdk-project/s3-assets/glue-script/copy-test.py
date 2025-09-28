import boto3

# Initialize S3 client
s3 = boto3.client('s3')

# Define source and destination
source_bucket = 'diw-test-bucket2'
source_key = 'inbound/test.txt'
destination_key = 'outbound/test.txt'

# Copy source object to destination
copy_source = {
    'Bucket': source_bucket,
    'Key': source_key
}

try:
    s3.copy_object(
        CopySource=copy_source,
        Bucket=source_bucket,
        Key=destination_key
    )
    print(f"File copied from {source_key} to {destination_key} successfully.")
except Exception as e:
    print(f"Error copying file: {e}")  