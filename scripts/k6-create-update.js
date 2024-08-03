import http from 'k6/http';
import { check, group } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export let options = {
    vus: 10, // Total virtual user
    duration: '10s', // Duration tes
    iterations: 3500,
    thresholds: {
        'http_req_duration': ['avg<2000'], // 95% of responses should be under 2 seconds
        'http_req_failed': ['rate<0.1'], // Failure rate should be less than 0.1 (10%)
    },
};

export default function () {
    let assetId;

    group('Create', function () {
        let postData = {
            "name": "valera",
            "job": "programmer"
        };

        let createResponse = http.post('https://reqres.in/api/users/', JSON.stringify(postData), {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        check(createResponse, {
            'Create user status is 201': (r) => r.status === 201,
            'Create user contains ID': (r) => {
                let createdData = JSON.parse(r.body);
                if (!createdData.hasOwnProperty('id')) {
                    console.error('Response does not contain ID property:', r.body);
                    return false;
                }
                if (isNaN(Number(createdData.id))) {
                    console.error('ID is not a number:', createdData.id);
                    return false;
                }

                assetId = createdData.id;
                return true;
            },
        });
    });

    // Group for Update asset
    group('Update', function () {
        if (!assetId) {
            console.error('assetId is not defined');
            return;
        }

        let updateData = {
            "name": "vitya",
            "job": "programmer"
        };

        let updateResponse = http.put(`https://reqres.in/api/users/${assetId}`, JSON.stringify(updateData), {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        check(updateResponse, {
            'Update user status is 200': (r) => r.status === 200,
            'Update user contains updated data': (r) => {
                let updatedData = JSON.parse(r.body);
                return updatedData.name === "vitya";
            },
        });
    });
}

// The K6 HTML report exporter, but the console output disappears !
// export function handleSummary(data) {
//     return {
//       "summary.html": htmlReport(data),
//     };
//   }
