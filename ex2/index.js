const express = require('express')
const app = express()
const port = 3000
const busboy = require('busboy');
const spawn = require('child_process').spawn;
const { Readable, PassThrough } = require('stream');
const { Storage } = require('@google-cloud/storage');

const project_id = 'xxx'
const credential_file = './xxx.json'
const bucketName = 'xxxxx'
const storage = new Storage({
    projectId: project_id,
    keyFilename: credential_file
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})


function gcsUpload(passthroughStream, file) {

    return new Promise(async (resolve, reject) => {

        passthroughStream.pipe(file.createWriteStream()).on('finish', () => {

            resolve({ 'status': 'uploded' })

        }).on('error', (err) => {
            if (err) {
                reject(err)
            }
        })

    })
}



app.post('/upload', (req, res) => {

    console.time("start-process")
    const chunks = [];
    let original_name = ''

    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {

        original_name = info['filename']

        file.on('data', (data) => {
            chunks.push(data);
        }).on('close', () => {
            console.log(`file done`);
        })


    });

    bb.on('close', async () => {

        const readableStream1 = new Readable({
            read() {
                for (const dataChunk of chunks) {
                    this.push(dataChunk);
                }
                this.push(null); 
            }
        });

        const readableStream2 = new Readable({
            read() {
                for (const dataChunk of chunks) {
                    this.push(dataChunk);
                }
                this.push(null); // Signals end of stream
            }
        });

        readableStream1.on('end', () => {
            console.log('readableStream1 end event triggered.');
        });
        readableStream2.on('end', () => {
            console.log('readableStream2 end event triggered.');
        });



        let command = '/opt/homebrew/bin/ffmpeg'
        let args = [
            '-r',
            '8',
            '-i',
            'pipe:0',
            '-vf',
            'scale=iw/4:ih/4',
            '-q:v',
            '5',
            '-vframes',
            '1',
            '-update',
            '1',
            '-f',
            'image2pipe', 
            '-c:v',
            'mjpeg', 
            'pipe:1'
        ];


        let options = { captureStdout: true, stdoutLines: 0 }
        let ffmpegProc = spawn(command, args, options);
        if (ffmpegProc.stderr) {
            ffmpegProc.stderr.setEncoding('utf8');
        }

        ffmpegProc.on('error', function (err) {
            console.log('ffmpegProc error ', err);
        });

        ffmpegProc.on('exit', function (code, signal) {
            console.log('ffmpegProc exit ', code, signal);

        });


        ffmpegProc.stdout.on('data', function (data) {
            console.log("ffmpegProc stdout data", data);
        });

        ffmpegProc.stdout.on('close', function () {
            console.log("ffmpegProc stdout close");
        });


        ffmpegProc.stderr.on('data', function (data) {
            console.log("ffmpegProc stderr data", data);
        });

        ffmpegProc.stderr.on('close', function () {
            console.log("ffmpegProc stderr close");
        });

        ffmpegProc.stdin.on('error', function (err) {
            console.log('ignore ffmpegProc stdin error');
        });

        readableStream1.pipe(ffmpegProc.stdin);


        let myBucket = storage.bucket(bucketName);
        let file_thm = myBucket.file(`devdevdev/thumbnail_${original_name.split('.')[0]}.jpg`);
        let file_ori = myBucket.file(`devdevdev/${original_name}`);


        try {

            await gcsUpload(ffmpegProc.stdout, file_thm)
            await gcsUpload(readableStream2, file_ori)

        } catch (err) {
            console.log(err);
            return res.send('err')
        }

        res.send("finish")
        console.timeEnd("start-process")

        console.log('bb close');

    });
    bb.on('finish', async () => {
        console.log('finish');
    });
    req.pipe(bb);

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})