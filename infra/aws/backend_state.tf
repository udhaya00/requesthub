terraform {
  backend "s3" {
  bucket = "smart-request-hub-prod-361103952894-b89a47"
  key    = "terraform.tfstate"
  region = "ap-south-1"
}
}
