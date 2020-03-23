[
  {
    "name": "prisma",
    "image": "${app_image}",
    "cpu": ${fargate_cpu},
    "environment": [
        {
          "name": "JAVA_OPTS",
          "value": "-Xmx1350m"
        },

        {
          "name": "PRISMA_CONFIG",
          "value": "${prisma_config}"
        }
     ],
    "memory": ${fargate_memory},
    "networkMode": "awsvpc",
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/prisma",
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
