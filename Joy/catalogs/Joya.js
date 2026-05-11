const { spawn } = require("child_process");
const express = require("express");
const app = express();
const chalk = require('chalk');
const path = require('path');

const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.status(200).send("JOY-BOT IS RUNNING!");
});

function startBot() {
    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.cyan('[ SYSTEM ] ') + chalk.white('STARTING BOT ENGINE...'));
    
    const botPath = path.join(__dirname, "Joyb.js");

    // spawn লজিকটি একটু পরিবর্তন করা হয়েছে যাতে আউটপুট নিশ্চিত হয়
    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Joyb.js"], {
        cwd: __dirname,
        stdio: "inherit", // সরাসরি মেইন কনসোলে আউটপুট পাঠাবে
        shell: true,      // উইন্ডোজ/লিনাক্স উভয় ক্ষেত্রে কমান্ড এক্সিকিউট করতে সাহায্য করে
        env: { 
            ...process.env, 
            FORCE_COLOR: "true"
        }
    });

    child.on("close", (code) => {
        console.log(chalk.red(`[ SYSTEM ] Bot process exited (Code: ${code}). Restarting...`));
        setTimeout(() => startBot(), 5000);
    });

    child.on("error", (err) => {
        console.error(chalk.red(`[ ERROR ] Failed to spawn Joyb.js: `), err);
    });
}

app.listen(PORT, "0.0.0.0", () => {
    console.log(chalk.green('[ SERVER ] ') + chalk.white(`Live on Port: ${PORT}`));
    // ৫ সেকেন্ড অপেক্ষা করার দরকার নেই, সরাসরি রান করুন যদি ফাইল পাথ ঠিক থাকে
    startBot();
});
