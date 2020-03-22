resource "aws_ecs_cluster" "phoenix" {
  name = "phoenix"
}

data "template_file" "phoenix" {
  template = file("./templates/ecs.tpl")

  vars = {
    app_image           = var.phoenix_image
    app_port            = var.phoenix_port
    fargate_cpu         = var.fargate_cpu
    fargate_memory      = var.fargate_memory
    aws_region          = var.region
    google_client_id    = var.GOOGLE_CLIENT_ID
    prisma_host         = var.PRISMA_HOST
    prisma_secret       = var.PRISMA_SECRET
    nodemailer_password = var.NODEMAILER_PASSWORD
  }
}


resource "aws_ecs_task_definition" "phoenix" {
  family                   = "phoenix"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  container_definitions    = data.template_file.phoenix.rendered
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_ecs_service" "phoenix" {
  name            = "phoenix"
  cluster         = aws_ecs_cluster.phoenix.id
  task_definition = aws_ecs_task_definition.phoenix.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = aws_subnet.phoenix.*.id
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = "phoenix"
    container_port   = var.phoenix_port
  }
  depends_on = [aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_task_execution_role]
}
