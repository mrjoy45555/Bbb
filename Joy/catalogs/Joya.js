const { spawn } = require("child_process");
const express = require("express");
const app = express();
const chalk = require('chalk');
const path = require('path');

const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.status(200).send("JOY-BOT IS ACTIVE AND RUNNING!");
});

function startBot() {
    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.cyan('[ SYSTEM ] ') + chalk.white('INITIATING COMMAND DEPLOYMENT...'));
    
    // Joyb.js এর ফুল পাথ সেট করা
    const botPath = path.resolve(__dirname, "Joyb.js");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", botPath], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true,
        env: { 
            ...process.env, 
            FORCE_COLOR: "true",
            NODE_ENV: "production" 
        }
    });

    child.on("close", (codeExit) => {
        console.log(chalk.red(`[ SYSTEM ] Bot process closed with code ${codeExit}. Restarting...`));
        setTimeout(() => startBot(), 5000);
    });

    child.on("error", (err) => {
        console.error(chalk.red(`[ ERROR ] Failed to start bot: `), err);
    });
}

// Render-এ লাইভ হওয়ার আগে ৫ সেকেন্ড সময় দিন যাতে ফাইল সিস্টেম রেডি হয়
app.listen(PORT, "0.0.0.0", () => {
    console.log(chalk.green('[ SERVER ] ') + chalk.white(`Port ${PORT} detected. Building Environment...`));
    
    setTimeout(() => {
        startBot();
    }, 5000); // ৫ সেকেন্ড ওয়েট করবে যাতে কমান্ড লোড করার জন্য রিসোর্স পায়
});
