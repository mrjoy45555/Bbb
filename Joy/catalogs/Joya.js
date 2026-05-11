const { spawn } = require("child_process");
const express = require("express");
const app = express();
const chalk = require('chalk');
const logger = require("./Joyc.js");
const path = require('path');

// Render PORT handling
const PORT = process.env.PORT || 10000;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/website/Joy.html'), (err) => {
    if (err) res.status(200).send("JOY-BOT Server is Active!");
  });
});

function startBot(message) {
    if (message) logger(message, "starting");

    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.cyan('[ SYSTEM ] ') + chalk.white('DEPLOYING MAIN SYSTEM...'));
    
    // Path resolve করা হয়েছে যাতে কমান্ড ফোল্ডার খুঁজে পেতে সমস্যা না হয়
    const botPath = path.join(__dirname, "Joyb.js");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", botPath], {
        cwd: __dirname, // এটি নিশ্চিত করে যে Joy/catalogs ফোল্ডার থেকেই কমান্ড খোঁজা হবে
        stdio: "inherit",
        shell: true,
        env: { ...process.env, FORCE_COLOR: "true" }
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0) {
            console.log(chalk.red(`[ ERROR ] `) + chalk.white(`Bot exited with code ${codeExit}. Restarting in 5s...`));
            setTimeout(() => startBot(), 5000); // ৫ সেকেন্ড পর অটো রিস্টার্ট
        }
    });

    child.on("error", function(error) {
        console.error(chalk.red(`[ CRITICAL ERROR ] `), error);
    });
}

// সার্ভার লিসেন করার পর বট স্টার্ট করুন
app.listen(PORT, "0.0.0.0", () => {
    logger.loader(`Server is running on port ${chalk.blueBright(PORT)}`);
    console.log(chalk.green('[ STATUS ] ') + chalk.white('Service is live. Initializing Bot...'));
    startBot();
});

// প্রোসেস যাতে মাঝপথে বন্ধ না হয় তার জন্য এরর হ্যান্ডলার
process.on('unhandledRejection', (reason, p) => {
    // console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
