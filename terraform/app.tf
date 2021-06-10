resource "heroku_addon" "database" {
  app  = heroku_app.main.id
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_config" "main" {
  vars = {
    GOOGLE_CLIENT_ID = var.google_client_id
  }

  sensitive_vars = {
    PHOENIX_SECRET        = var.phoenix_secret
    NODEMAILER_PASSWORD   = var.nodemailer_password
    AWS_ACCESS_KEY_ID     = var.aws_access_key
    AWS_SECRET_ACCESS_KEY = var.aws_secret_access_key
    SLS_SECRET            = var.sls_secret
  }
}

resource "heroku_app_config_association" "main" {
  app_id = heroku_app.main.id

  vars           = heroku_config.main.vars
  sensitive_vars = heroku_config.main.sensitive_vars
}

resource "heroku_app" "main" {
  name       = "rctech-phoenix"
  region     = var.region
  buildpacks = ["heroku/nodejs"]
}

resource "heroku_build" "main" {
  app = heroku_app.main.id

  source {
    url     = "https://github.com/rcltech/phoenix/archive/master.tar.gz"
    version = var.release_tag
  }
}

resource "heroku_formation" "main" {
  app      = heroku_app.main.id
  type     = "web"
  quantity = 1
  size     = "free"

  depends_on = [heroku_build.main]
}

resource "heroku_domain" "main" {
  app      = heroku_app.main.id
  hostname = "phoenix.rctech.club"
}
