# Terraform code for Phoenix

## Install `terraform` using `tfenv`

```shell script
brew install tfenv
```

Check if your `terraform` matches the version in `.terraform-version`.

```shell script
cat .terraform-version
terraform version
```

If not, install and use the right version with `tfenv`.

```shell script
tfenv install [version]
tfenv use [version]
```

## Apply

Run on terraform cloud.

```shell script
terraform apply
```

### State Files

State fils are stored on terraform cloud.

## Destroy

Run the command:

```shell script
terraform destroy
```

## CI/CD using Terraform Cloud

The remote `backend` has been set to [Terraform Cloud](https://app.terraform.io/app/rctech/workspaces/phoenix), which listens to VCS changes in this github repository. Also `terraform apply` has been set to run whenever this `/terraform` directory has changes.
