const { spawn } = require("child_process")

let child = spawn("sh", [`./wrong-script.sh`, "./video.mp4", "output.jpg"], { shell: true });
// let child = spawn("sh", [`./good-script.sh`, "./video.mp4", "output.jpg"], { shell: true });

child.stdout.on("data", (data) => {
    console.log(`STDOUT   ${data.toString()}`);
})
child.stderr.on("data", (data) => {
    console.log(`STDERR   ${data.toString()}`);
})