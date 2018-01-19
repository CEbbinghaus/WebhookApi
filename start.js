const child = require("child_process");
child.exec("pm2 start server.js --name='API' --watch", (e, out, err) => {
    console.log("Started Bot")
    process.exit(0);
})