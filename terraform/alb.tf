resource "aws_alb" "main" {
  name            = "phoenix"
  subnets         = aws_subnet.phoenix.*.id
  security_groups = [aws_security_group.lb.id]
}

resource "aws_alb_target_group" "phoenix" {
  name        = "phoenix"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = "/"
    unhealthy_threshold = "2"
  }
}

resource "aws_alb_target_group" "prisma" {
  name        = "prisma"
  port        = 60000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    healthy_threshold   = "2"
    interval            = "6"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "5"
    path                = "/status"
    unhealthy_threshold = "2"
  }
}

resource "aws_alb_listener" "front_end_phoenix" {
  load_balancer_arn = aws_alb.main.id
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.phoenix.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "front_end_prisma" {
  load_balancer_arn = aws_alb.main.id
  port              = 60000
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.prisma.id
    type             = "forward"
  }
}