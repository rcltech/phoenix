terraform {
  required_providers {
    heroku = {
      source  = "heroku/heroku"
      version = "~> 4.0"
    }
  }

  backend "remote" {
    organization = "rctech"

    workspaces {
      name = "phoenix"
    }
  }
}

provider "heroku" {
  email   = "technology@rctech.club"
  api_key = var.heroku_api_key
}
