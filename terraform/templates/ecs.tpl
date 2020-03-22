[
  {
    "name": "phoenix",
    "image": "${app_image}",
    "cpu": ${fargate_cpu},
    "environment": [
        {
          "name": "GOOGLE_CLIENT_ID",
          "value": "${google_client_id}"
        },
        {
          "name": "NODEMAILER_PASSWORD",
          "value": "${nodemailer_password}"
        },
        {
          "name": "PRISMA_HOST",
          "value": "${prisma_host}"
        },
        {
          "name": "PRISMA_SECRET",
          "value": "${prisma_secret}"
        }
     ],
    "memory": ${fargate_memory},
    "networkMode": "awsvpc",
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/phoenix",
          "awslogs-region": "${aws_region}",
          "awslogs-stream-prefix": "ecs"
        }
    },
    "portMappings": [
      {
        "containerPort": ${app_port},
        "hostPort": ${app_port}
      }
    ]
  }
]
