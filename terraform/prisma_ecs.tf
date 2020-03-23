data "template_file" "prisma" {
  template = file("./templates/prisma.tpl")

  vars = {
    app_image      = var.prisma_image
    app_port       = var.prisma_port
    fargate_cpu    = var.fargate_cpu
    fargate_memory = var.fargate_memory
    aws_region     = var.region
    prisma_config  = var.PRISMA_CONFIG
  }
}

resource "aws_ecs_task_definition" "prisma" {
  family                   = "prisma"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  container_definitions    = data.template_file.prisma.rendered
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_ecs_service" "prisma" {
  name            = "prisma"
  cluster         = aws_ecs_cluster.phoenix.id
  task_definition = aws_ecs_task_definition.prisma.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = aws_subnet.phoenix.*.id
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.prisma.id
    container_name   = "prisma"
    container_port   = var.prisma_port
  }
  depends_on = [aws_alb_listener.front_end_prisma, aws_iam_role_policy_attachment.ecs_task_execution_role, aws_ecs_cluster.phoenix]
}
