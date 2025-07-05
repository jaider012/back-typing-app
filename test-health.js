#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3001';

const endpoints = [
  '/api/health/simple',
  '/api/health/detailed',
  '/api/metrics',
  '/api/metrics/prometheus',
];

async function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${endpoint}`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          endpoint,
          status: res.statusCode,
          headers: res.headers,
          data: data,
          success: res.statusCode === 200,
        });
      });
    });

    req.on('error', (err) => {
      reject({
        endpoint,
        error: err.message,
        success: false,
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject({
        endpoint,
        error: 'Request timeout',
        success: false,
      });
    });
  });
}

async function runTests() {
  console.log('🏥 Testing Health Check Endpoints\n');
  console.log('='.repeat(50));

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const result = await testEndpoint(endpoint);
      results.push(result);

      if (result.success) {
        console.log(`✅ ${endpoint} - Status: ${result.status}`);

        // Try to parse JSON for non-prometheus endpoints
        if (!endpoint.includes('prometheus')) {
          try {
            const parsed = JSON.parse(result.data);
            console.log(
              `   📊 Response preview:`,
              Object.keys(parsed).join(', '),
            );
          } catch (e) {
            console.log(`   📄 Response length: ${result.data.length} chars`);
          }
        } else {
          console.log(
            `   📈 Prometheus metrics: ${result.data.split('\n').length} lines`,
          );
        }
      } else {
        console.log(`❌ ${endpoint} - Status: ${result.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.error || error.message}`);
      results.push(error);
    }
    console.log('');
  }

  // Summary
  console.log('='.repeat(50));
  console.log('📋 Test Summary:');

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);

  if (failed === 0) {
    console.log('\n🎉 All health check endpoints are working correctly!');
  } else {
    console.log('\n⚠️  Some endpoints are not working. Check the server logs.');
  }

  return results;
}

// Run the tests
runTests().catch(console.error) 
