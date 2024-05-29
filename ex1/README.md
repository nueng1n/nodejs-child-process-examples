ตัวอย่างในการ child process กับ spawn แต่ปัญหาเกิดที่ ffmpeg นั้นดันส่งทุกอย่างใส่ stderr ไม่ใช่แค่ err แต่เป็น stdout ด้วยทำให้หากใช้วิธีตรงๆแบบใน ex1-wrong.js



```

child.stdout.on("data", (data) => {
    console.log(`STDOUT   ${data.toString()}`);
})
child.stderr.on("data", (data) => {
    console.log(`STDERR   ${data.toString()}`);
})

```

จะไม่เห็นปัญหาได้ ในตัวอย่างผมได้ทำให้ script ของ good และ wrong script .sh ต่างกันแค่ good ใช้ LF และ wrong ใช้  CRLF ทำให้หากนำมารันใน unix ก็จะไม่ทำงานได้

IMG 1

<img width="1413" alt="img1" src="https://github.com/nueng1n/nodejs-child-process-examples/assets/115057360/ca99b467-0df3-47dd-ade3-0cab7bc8c31f">


รูป img1 จะแสดงให้เห็นว่า

```

// let child = spawn("sh", [`./wrong-script.sh`, "./video.mp4", "output.jpg"], { shell: true });
let child = spawn("sh", [`./good-script.sh`, "./video.mp4", "output.jpg"], { shell: true });

```

ใช้ good script จะรันได้และสร้าง output.jpg มาใน dir

IMG2

<img width="252" alt="img2" src="https://github.com/nueng1n/nodejs-child-process-examples/assets/115057360/cfe45807-a5df-4273-93f0-02134f986847">


และ กรณี


```

let child = spawn("sh", [`./wrong-script.sh`, "./video.mp4", "output.jpg"], { shell: true });
//let child = spawn("sh", [`./good-script.sh`, "./video.mp4", "output.jpg"], { shell: true });

```

ก็จะแสดงใน stderr เท่านั้นแต่จะไม่สร้าง output.jpg ใน img3

IMG3

<img width="1407" alt="img3" src="https://github.com/nueng1n/nodejs-child-process-examples/assets/115057360/60176919-84ad-4747-994e-f7424bbee7dd">


ส่วนวิธีการเขียนนั้นที่จะได้แก้ปัญหานี้จะแสดงใน ex1-good.js
