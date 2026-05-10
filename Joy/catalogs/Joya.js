const { spawn } = require("child_process");
const express = require("express");
const app = express();
const chalk = require('chalk');
const logger = require("./Joyc.js");
const path = require('path');

// Render-এ শুধুমাত্র process.env.PORT প্রয়োজন, এতগুলো পোর্টের দরকার নেই
const PORT = process.env.PORT || 10000;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/website/Joy.html'));
});

function startBot(message) {
    if (message) logger(message, "starting");

    console.log(chalk.blue('DEPLOYING MAIN SYSTEM'));
    
    // Child process শুরু করার আগে সার্ভার লিসেন করা ভালো
    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Joyb.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0) {
            console.log(chalk.red(`Bot process exited with code ${codeExit}. Restarting...`));
            startBot();
        }
    });

    child.on("error", function(error) {
        logger("an error occurred : " + JSON.stringify(error), "error");
    });
}

// Render-এর রিকোয়ারমেন্ট অনুযায়ী আগে সার্ভার লিসেন করুন
app.listen(PORT, () => {
    logger.loader(`Server is running on port ${chalk.blueBright(PORT)}`);
    // সার্ভার রান হওয়ার পর বট স্টার্ট হবে
    startBot();
});
