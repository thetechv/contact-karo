
const http = require('http');

const TOTAL_REQUESTS = 60;
// Using a dummy ID 'test-tag-id'
const URL = 'http://localhost:3000/api/v0/tag/test-tag-id/generateOtp'; 

async function sendRequest(i) {
  return new Promise((resolve) => {
    const req = http.request(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          requestNum: i
        });
      });
    });

    req.on('error', (e) => {
      resolve({
        status: 'ERROR',
        requestNum: i,
        error: e.message
      });
    });

    // Send a dummy body
    req.write(JSON.stringify({ phone: '9834567890' }));
    req.end();
  });
}

async function runTest() {
  console.log(`Starting stress test on ${URL}`);
  console.log(`Sending ${TOTAL_REQUESTS} requests...`);
  
  const promises = [];
  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    // Add small delay to avoid overwhelming simple connection limits immediately
    // or run them in parallel. Parallel is better for testing rate limit concurrency.
    promises.push(sendRequest(i));
  }

  const results = await Promise.all(promises);

  let successCount = 0;
  let blockedCount = 0;
  let otherCount = 0;

  results.sort((a, b) => a.requestNum - b.requestNum);

  results.forEach(r => {
    if (r.status === 200 || r.status === 201 || r.status === 400 || r.status === 404 || r.status === 500) { 
       // Counting 400/404/500 as "passed through middleware" potentially, 
       // but specifically we are looking for 429 or 403.
       // 500 might be Redis error.
       if (r.status === 500) {
         console.log(`Request ${r.requestNum}: 500 (Server Error - Check logs)`);
       } else if (r.status === 200) {
           console.log(`Request ${r.requestNum}: 200 OK`);
       } else {
           // It didn't get blocked by rate limiter
       }
       
       if (r.status !== 429 && r.status !== 403) successCount++;
    } 
    
    if (r.status === 429) {
        console.log(`Request ${r.requestNum}: 429 Too Many Requests`);
        blockedCount++;
    }
    if (r.status === 403) {
        console.log(`Request ${r.requestNum}: 403 Forbidden`);
        blockedCount++;
    }
  });

  console.log('\n--- Summary ---');
  console.log(`Total Requests: ${TOTAL_REQUESTS}`);
  console.log(`Passed (Not Rate Limited): ${successCount}`);
  console.log(`Blocked (429/403): ${blockedCount}`);
  
  if (blockedCount > 0) {
      console.log('✅ Rate limiting is WORKING.');
  } else {
      console.log('❌ Rate limiting is NOT working (or limit not reached).');
  }
}

runTest();
