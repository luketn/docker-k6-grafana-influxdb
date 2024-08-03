import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const myCounter = new Counter('my_custom_counter');
const myTrend = new Trend('my_custom_trend');

export let options = {
    vus: 10,
    duration: '30s',
    thresholds: {
        'http_req_duration': ['p(95)<500'],
    },
};

export default function () {
    const url = 'https://reqres.in/api/users/2';

    let res = http.get(url);

    myCounter.add(1, { tag: 'requests' });
    myTrend.add(res.timings.duration, { tag: 'response_time' });

    let checkResult = check(res, {
        'status was 200': (r) => r.status === 200,
    });

    if (checkResult) {
        myCounter.add(1, { tag: 'success' });
    } else {
        errorRate.add(1);
        myCounter.add(1, { tag: 'failure' });
    }

    // Дополнительная этикетка для различных условий эксплуатации
    myTrend.add(res.timings.duration, { environment: 'production' });

    sleep(1);
}
