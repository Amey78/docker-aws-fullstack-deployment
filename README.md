# Docker AWS Fullstack Deployment

Simple visit counter app (Nginx + Node.js + PostgreSQL) running with Docker Compose on AWS EC2.

## Run
    docker compose up -d --build

Open http://localhost (or http://EC2-PUBLIC-IP on AWS).

## Check
    curl http://localhost/api/health
    docker compose logs backend

Data is saved in a Docker volume, so it stays after restart.
