const child = require("child_process");
child.exec("pm2 start server.js --name='API' --watch")
process.exit(0)