resource "aws_cloudwatch_log_group" "phoenix_log_group" {
  name              = "/ecs/phoenix"
  retention_in_days = 30

  tags = {
    Name = "phoenix_log_group"
  }
}

resource "aws_cloudwatch_log_stream" "cb_log_stream" {
  name           = "phoenix_log_stream"
  log_group_name = aws_cloudwatch_log_group.phoenix_log_group.name
}
