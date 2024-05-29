const { spawn } = require("child_process")

var convertToImg = function (callback) {

    let ffmpeg = spawn("sh", [`./wrong-script.sh`, "./video.mp4", "output.jpg"], { shell: true });

    // let ffmpeg = spawn("sh", [`./good-script.sh`, "./video.mp4", "output.jpg"], { shell: true });

    var err = '';
    ffmpeg.stderr.on('data', function (c) { err += c; }).on('end', function () {
        console.log('stderr:', err);
    });


    ffmpeg.stdout.on('data', function (c) { err += c; }).on('end', function () {
        console.log('stdout:', err);
    });


    ffmpeg.on('exit', function (code) {
        if (code) {
            callback({ code: code, message: err });
        } else {
            callback(null, { success: true, message: err });
        }
    });
}

convertToImg((data, status) => {
    console.log(` not complete ::::::  ${JSON.stringify(data, null, 4)} complete ::: ${JSON.stringify(status, null, 4)}`);
})