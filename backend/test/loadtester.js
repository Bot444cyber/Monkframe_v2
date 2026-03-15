import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 500, 
  duration: '30s', 
};

export default function () {
  const res = http.get('https://iums.duckdns.org');

  check(res, { 'status was 200': (r) => r.status == 200 });

  sleep(1);
}



