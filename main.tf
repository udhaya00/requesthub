provider "aws" {
  region = "ap-south-1"
}

resource "aws_s3_bucket" "test" {
  bucket = "udhaya-test-bucket-2026-123"
}