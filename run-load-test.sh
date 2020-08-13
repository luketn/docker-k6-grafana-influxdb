docker-compose up -d influxdb grafana
echo "----------------------------------------------------------"
echo "Load testing with Grafana dashboard http://localhost:3000/"
echo "----------------------------------------------------------"
docker-compose run k6 run /scripts/ewoks.js