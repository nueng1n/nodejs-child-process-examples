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

img1


รูป img1 จะแสดงให้เห็นว่า

```

// let child = spawn("sh", [`./wrong-script.sh`, "./video.mp4", "output.jpg"], { shell: true });
let child = spawn("sh", [`./good-script.sh`, "./video.mp4", "output.jpg"], { shell: true });

```

ใช้ good script จะรันได้และสร้าง output.jpg มาใน dir

img2

และ กรณี


```

let child = spawn("sh", [`./wrong-script.sh`, "./video.mp4", "output.jpg"], { shell: true });
//let child = spawn("sh", [`./good-script.sh`, "./video.mp4", "output.jpg"], { shell: true });

```

ก็จะแสดงใน stderr เท่านั้นแต่จะไม่สร้าง output.jpg ใน img3

ส่วนวิธีการเขียนนั้นที่จะได้แก้ปัญหานี้จะแสดงใน ex1-good.js
