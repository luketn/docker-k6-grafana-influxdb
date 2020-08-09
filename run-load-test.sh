docker-compose up -d influxdb grafana
docker-compose run k6 run /scripts/ewoks.js