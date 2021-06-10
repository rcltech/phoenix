output "hostname" {
  value = heroku_app.main.heroku_hostname
}

output "domain_dns_cname" {
  value = heroku_domain.main.cname
}
