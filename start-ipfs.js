const { exec, spawn } = require('child_process');

// CORS configs
exec('ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin \'["*"]\'', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error setting CORS origin: ${stderr}`);
    return;
  }
  console.log(`CORS origin set: ${stdout}`);
});

exec('ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods \'["PUT", "POST", "GET"]\'', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error setting CORS methods: ${stderr}`);
    return;
  }
  console.log(`CORS methods set: ${stdout}`);
});

// 启动 IPFS 守护进程
const ipfsDaemon = spawn('ipfs', ['daemon'], { stdio: 'pipe' });

ipfsDaemon.stdout.on('data', (data) => {
  console.log(`IPFS: ${data}`);
  if (data.toString().includes('API server listening on')) {
    console.log('IPFS daemon started successfully.');
    // spawn('npm', ['start'], { stdio: 'inherit' });
    setTimeout(() => {
      spawn('npm', ['start'], { stdio: 'inherit' });
    }, 2000);
  }
});

ipfsDaemon.on('error', (error) => {
  console.error(`Error starting IPFS daemon: ${error.message}`);
});

ipfsDaemon.on('exit', (code) => {
  console.log(`IPFS daemon exited with code ${code}`);
});
