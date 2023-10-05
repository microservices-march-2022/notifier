#!/bin/bash
set -e

# This configuration requires a new commit to change
NODE_ENV=production
PORT=4000

CONSUL_SERVICE_NAME="notifier-migrator"

# Consul host and port are included in each host since we
# cannot query consul until we know them
CONSUL_CLIENT_HOST="${CONSUL_CLIENT_HOST}"
CONSUL_CLIENT_PORT="${CONSUL_CLIENT_PORT}"
CONSUL_HOST="${CONSUL_SERVER_HOST}"
CONSUL_PORT="${CONSUL_SERVER_PORT}"

# Note we get the migrator user name and password
POSTGRES_USER=$(curl -X GET "http://${CONSUL_HOST}:${CONSUL_PORT}/v1/kv/notifier-db-migrator-user?raw=true")
PGPORT=$(curl -X GET "http://${CONSUL_HOST}:${CONSUL_PORT}/v1/kv/notifier-db-port?raw=true")
PGHOST=$(curl -X GET http://localhost:8500/v1/kv/notifier-db-host?raw=true)
# Note that you should never do this. Passwords should be stored in encrypted secrets storage.
PGPASSWORD=$(curl -X GET "http://${CONSUL_HOST}:${CONSUL_PORT}/v1/kv/notifier-db-migrator-password-never-do-this?raw=true")

# RabbitMQ configuration by pulling from the system
AMQPHOST=$(curl -X GET "http://${CONSUL_HOST}:${CONSUL_PORT}/v1/kv/amqp-host?raw=true")
AMQPPORT=$(curl -X GET "http://${CONSUL_HOST}:${CONSUL_PORT}/v1/kv/amqp-port?raw=true")

docker run \
  --rm \
  -d \
  --name notifier-migrator \
  -e NODE_ENV="${NODE_ENV}" \
  -e PORT="${PORT}" \
  -e JSON_BODY_LIMIT="${JSON_BODY_LIMIT}" \
  -e PGUSER="${POSTGRES_USER}" \
  -e PGPORT="${PGPORT}" \
  -e PGHOST="${PGHOST}" \
  -e PGPASSWORD="${PGPASSWORD}" \
  -e AMQPPORT="${AMQPPORT}" \
  -e AMQPHOST="${AMQPHOST}" \
  -e CONSUL_HOST="${CONSUL_CLIENT_HOST}" \
  -e CONSUL_PORT="${CONSUL_CLIENT_PORT}" \
  -e CONSUL_SERVICE_NAME="${CONSUL_SERVICE_NAME}" \
  --network mm_2023 \
  notifier