# Terraform code for Phoenix

The infrastructure management of Phoenix is being moved to CI.

To run locally, make sure you have the right environment variables in `secrets.tfvars`.

Then run the command:

```
terraform apply -var-file=secrets.tfvars
```

The backend for Terraform is also moving to the cloud, making deployment independent of the developer machine.
