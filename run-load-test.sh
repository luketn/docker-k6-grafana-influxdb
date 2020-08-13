docker-compose up -d influxdb grafana
echo "Load testing with Grafana dashboard http://localhost:3000/"
docker-compose run k6 run /scripts/ewoks.js