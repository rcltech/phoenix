# Terraform code for Phoenix

## Apply

To run locally, make sure you have the right environment variables in `secrets.tfvars`.

Then run the command:

```shell script
terraform apply -var-file=secrets.tfvars
```

### State Files
As of this writing, the terraform state files are hosted in the [rctech-phoenix-terraform-state S3 bucket](https://s3.console.aws.amazon.com/s3/buckets/rctech-phoenix-terraform-state?region=us-east-2&tab=objects).

## Destroy

Make sure that you have a copy of the latest environment variables, and state files.

Run the command:

```shell script
terraform destroy
```

## CI/CD for Terraform

The backend for Terraform is also moving to the cloud via github actions, making deployment independent of the developer machine.
