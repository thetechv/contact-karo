
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
      // Consume data to free memory
      res.resume();
      resolve({
        status: res.statusCode,
        requestNum: i
      });
    });

    req.on('error', (e) => {
      resolve({
        status: 'ERROR',
        requestNum: i,
        error: e.message
      });
    });

    // Generate a unique phone number for each request to bypass the "Phone Limit"
    // This forces the "IP Limit" (50 max) to be the only active constraint.
    const uniquePhone = `98${String(i).padStart(8, '0')}`;
    
    req.write(JSON.stringify({ phone: uniquePhone }));
    req.end();
  });
}

async function runTest() {
  console.log(`Starting IP RATE LIMIT stress test on ${URL}`);
  console.log(`Sending ${TOTAL_REQUESTS} requests with UNIQUE phone numbers...`);
  
  const promises = [];
  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    promises.push(sendRequest(i));
  }

  const results = await Promise.all(promises);

  let successCount = 0;
  let blockedCount = 0;

  results.sort((a, b) => a.requestNum - b.requestNum);

  results.forEach(r => {
    // 200, 201, 400, 404, 500 are considered "NOT Rate Limited"
    if (r.status !== 429 && r.status !== 403) {
        successCount++;
        // console.log(`Request ${r.requestNum}: ${r.status} (Allowed)`);
    } else {
        console.log(`Request ${r.requestNum}: ${r.status} (Blocked)`);
        blockedCount++;
    }
  });

  console.log('\n--- Summary ---');
  console.log(`Total Requests: ${TOTAL_REQUESTS}`);
  console.log(`Allowed (Should be ~50): ${successCount}`);
  console.log(`Blocked (Should be ~10): ${blockedCount}`);
  
  if (successCount >= 45 && successCount <= 55 && blockedCount > 0) {
      console.log('✅ IP Rate limiting is WORKING cleanly around the 50 limit.');
  } else {
      console.log('⚠️ Result is unexpected. Check if Redis keys were cleared first.');
  }
}

runTest();
