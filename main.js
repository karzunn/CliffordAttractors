let imgData;
let context;
let pixels = [];

let calc = document.getElementById("Calc")
let disp = document.getElementById("Disp")
let rend = document.getElementById("Rend")
let res = document.getElementById("res")
let iter = document.getElementById("iterations")
let workers = document.getElementById("workers")
let A = document.getElementById("A")
let B = document.getElementById("B")
let C = document.getElementById("C")
let D = document.getElementById("D")
let dHue = document.getElementById("dHue")
let dSat = document.getElementById("dSat")
let dLight = document.getElementById("dLight")
let hHue = document.getElementById("hHue")
let hSat = document.getElementById("hSat")
let hLight = document.getElementById("hLight")
let download = document.getElementById("save")

calc.addEventListener('click',calcMode)
disp.addEventListener('click',dispMode)
rend.addEventListener('click',rendMode)

download.addEventListener('click', downloadRender, false);
download.addEventListener('touch', downloadRender, false);

res.addEventListener('mouseup',RenderImage)
iter.addEventListener('mouseup',RenderImage)
workers.addEventListener('mouseup',RenderImage)

res.addEventListener('touchend',RenderImage)
iter.addEventListener('touchend',RenderImage)
workers.addEventListener('touchend',RenderImage)

A.addEventListener('input',RenderImageLowRes)
B.addEventListener('input',RenderImageLowRes)
C.addEventListener('input',RenderImageLowRes)
D.addEventListener('input',RenderImageLowRes)

hHue.addEventListener('input',RenderImageLowRes)
hSat.addEventListener('input',RenderImageLowRes)
hLight.addEventListener('input',RenderImageLowRes)
dHue.addEventListener('input',RenderImageLowRes)
dSat.addEventListener('input',RenderImageLowRes)
dLight.addEventListener('input',RenderImageLowRes)

hHue.addEventListener('mouseup',editCanvas)
hSat.addEventListener('mouseup',editCanvas)
hLight.addEventListener('mouseup',editCanvas)
dHue.addEventListener('mouseup',editCanvas)
dSat.addEventListener('mouseup',editCanvas)
dLight.addEventListener('mouseup',editCanvas)

hHue.addEventListener('touchend',editCanvas)
hSat.addEventListener('touchend',editCanvas)
hLight.addEventListener('touchend',editCanvas)
dHue.addEventListener('touchend',editCanvas)
dSat.addEventListener('touchend',editCanvas)
dLight.addEventListener('touchend',editCanvas)

A.addEventListener('mouseup',RenderImage)
B.addEventListener('mouseup',RenderImage)
C.addEventListener('mouseup',RenderImage)
D.addEventListener('mouseup',RenderImage)

A.addEventListener('touchend',RenderImage)
B.addEventListener('touchend',RenderImage)
C.addEventListener('touchend',RenderImage)
D.addEventListener('touchend',RenderImage)


createCanvas(parseInt(res.value))
RenderImageLowRes()
RenderImage()
calcMode()


function RenderImage(){

    graySliders()

    let payload = {};
    payload.a=parseFloat(A.value);
    payload.b=parseFloat(B.value);
    payload.c=parseFloat(C.value);
    payload.d=parseFloat(D.value);
    payload.width=parseInt(res.value);
    payload.height=parseInt(res.value);
    payload.iters=parseInt(iter.value);

    let empty = [];
    for(var i = 0; i < (payload.width*payload.height*4); i++){
        empty.push(0);
    }

    let middle = getMiddle()

    payload.x=middle.x;
    payload.y=middle.y;

    let running = 0;

    for (let i=0;i<parseInt(workers.value);i++)
    {
        workerFor = new Worker('worker.js');

        workerFor.onmessage = function(event){

            for(var i = 0; i < (payload.width*payload.height*4); i++){
                empty[i]+=event.data[i];
            }
            
            --running;

            if (running===0)
            {

                pixels=[...empty];

                let bin_max = getMax(empty)

                let val

                for (let i=0;i<empty.length/4;i++)
                {
                        val=calcColor((empty[i*4]/bin_max),parseFloat(dHue.value),parseFloat(dSat.value),parseFloat(dLight.value),parseFloat(hHue.value),parseFloat(hSat.value),parseFloat(hLight.value));
                        empty[i*4]=val.r;
                        empty[i*4+1]=val.g;
                        empty[i*4+2]=val.b;
                        empty[i*4+3]=255
                }

                createCanvas(parseInt(res.value))
                imgData.data.set(empty)
                context.putImageData(imgData, 0, 0);

                whiteSliders()
            }
        };

        ++running;
        payload.x+=0.001;
        payload.y+=0.001;
        workerFor.postMessage(payload);
    }
};

function getMax(arr) {
    return arr.reduce((max, v) => max >= v ? max : v, -Infinity);
}

function getAvg(arr){
    var total = 0;
    for(var i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    return avg = total / arr.length;
}

function createCanvas(dim)
{
    let canvas = document.createElement('canvas');
    canvas.id = "myCanvas"
    canvas.fillStyle = "black";
    canvas.width  = dim;
    canvas.height = dim;
    let image_area = document.getElementById("image")
    image_area.removeChild(image_area.firstChild)
    image_area.prepend(canvas)

    context = canvas.getContext('2d');
    context.fillStyle = "black";
    context.fillRect(0, 0, dim, dim);
    imgData = context.createImageData(dim, dim);
}

function RenderImageLowRes(){

    let payload = {};
    payload.a=parseFloat(A.value);
    payload.b=parseFloat(B.value);
    payload.c=parseFloat(C.value);
    payload.d=parseFloat(D.value);
    payload.width=100;
    payload.height=100;
    payload.iters=5000;

    let empty = [];
    for(var i = 0; i < (payload.width*payload.height*4); i++){
        empty.push(0);
    }

    let middle = getMiddle()

    payload.x=middle.x;
    payload.y=middle.y;

    let running = 0;

    for (let i=0;i<1;i++)
    {
        workerFor = new Worker('worker.js');

        workerFor.onmessage = function(event){

            for(var i = 0; i < (payload.width*payload.height*4); i++){
                empty[i]+=event.data[i];
            }
            
            --running;

            if (running===0)
            {
                let bin_max = getMax(empty)

                let val

                for (let i=0;i<empty.length/4;i++)
                {
                        val=calcColor((empty[i*4]/bin_max),parseFloat(dHue.value),parseFloat(dSat.value),parseFloat(dLight.value),parseFloat(hHue.value),parseFloat(hSat.value),parseFloat(hLight.value)/(parseInt(res.value)/50));
                        empty[i*4]=val.r;
                        empty[i*4+1]=val.g;
                        empty[i*4+2]=val.b;
                        empty[i*4+3]=255
                }

                createCanvas(parseInt(payload.width))
                imgData.data.set(empty)
                context.putImageData(imgData, 0, 0);

            }
        };

        ++running;
        payload.x+=0.0000001;
        payload.y+=0.0000001;
        workerFor.postMessage(payload);
    }
};


function graySliders()
{
    var sliders = document.getElementsByClassName("slider");
    for (var i = 0; i < sliders.length; i++) {
        sliders[i].style.borderColor = "rgb(150, 150, 150)";
    }

}

function whiteSliders()
{
    var sliders = document.getElementsByClassName("slider");
    for (var i = 0; i < sliders.length; i++) {
        sliders[i].style.borderColor = "rgb(255, 255, 255)";
    }
}

function editCanvas(){

    let empty = [...pixels];

    let bin_max = getMax(empty)

    let val

    for (let i=0;i<empty.length/4;i++)
    {
            val=calcColor((empty[i*4]/bin_max),parseFloat(dHue.value),parseFloat(dSat.value),parseFloat(dLight.value),parseFloat(hHue.value),parseFloat(hSat.value),parseFloat(hLight.value));
            empty[i*4]=val.r;
            empty[i*4+1]=val.g;
            empty[i*4+2]=val.b;
            empty[i*4+3]=255
    }

    createCanvas(parseInt(res.value))
    imgData.data.set(empty)
    context.putImageData(imgData, 0, 0);

}

function downloadRender() {
    download.download = "A"+A.value+"B"+B.value+"C"+C.value+"D"+D.value+".png"
    let plot = document.getElementById("myCanvas")
    let dt = plot.toDataURL('image/jpeg');
    this.href = dt;
};

function calcMode(){
    rend.style.backgroundColor = "rgb(50,50,50)";
    disp.style.backgroundColor = "rgb(50,50,50)";
    calc.style.backgroundColor = "rgb(75,75,75)";
    var calcs = document.getElementsByClassName("calcControl");
    var disps = document.getElementsByClassName("dispControl");
    var rends = document.getElementsByClassName("rendControl");
    for (var i = 0; i < calcs.length; i++) {
        calcs[i].style.display = "inline";
    }
    for (var i = 0; i < disps.length; i++) {
        disps[i].style.display = "none";
    }
    for (var i = 0; i < rends.length; i++) {
        rends[i].style.display = "none";
    }
}

function dispMode(){
    calc.style.backgroundColor = "rgb(50,50,50)";
    rend.style.backgroundColor = "rgb(50,50,50)";
    disp.style.backgroundColor = "rgb(75,75,75)";
    var calcs = document.getElementsByClassName("calcControl");
    var disps = document.getElementsByClassName("dispControl");
    var rends = document.getElementsByClassName("rendControl");
    for (var i = 0; i < calcs.length; i++) {
        calcs[i].style.display = "none";
    }
    for (var i = 0; i < disps.length; i++) {
        disps[i].style.display = "inline";
    }
    for (var i = 0; i < rends.length; i++) {
        rends[i].style.display = "none";
    }
}

function rendMode(){
    calc.style.backgroundColor = "rgb(50,50,50)";
    disp.style.backgroundColor = "rgb(50,50,50)";
    rend.style.backgroundColor = "rgb(75,75,75)";
    var calcs = document.getElementsByClassName("calcControl");
    var disps = document.getElementsByClassName("dispControl");
    var rends = document.getElementsByClassName("rendControl");
    for (var i = 0; i < calcs.length; i++) {
        calcs[i].style.display = "none";
    }
    for (var i = 0; i < disps.length; i++) {
        disps[i].style.display = "none";
    }
    for (var i = 0; i < rends.length; i++) {
        rends[i].style.display = "inline";
    }
}

function getMiddle(){
    let a=parseFloat(A.value);
    let b=parseFloat(B.value);
    let c=parseFloat(C.value);
    let d=parseFloat(D.value);
    let X = [0];
    let Y = [0];
    let x_sum=0;
    let y_sum=0;
    for (let i=0;i<100;i++)
    {
        X.unshift(Math.sin(a*Y[0])+c*Math.cos(a*X[0]))
        Y.unshift(Math.sin(b*X[1])+d*Math.cos(b*Y[0]))
        x_sum+=X[0];
        y_sum+=Y[0];
    }
    return {"x":x_sum/100,"y":y_sum/100}

}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function calcColor(val,sh,ss,sl,hh,hs,hl)
{
    let final_result = {}
    let highlights = HSVtoRGB(hh/360, hs/100, ((hl**1.1)/3)*val**((1-(sl/101))/(sl/20)))
    let shadows = HSVtoRGB(sh/360, ss/100, val**(1-(sl/101)))
    final_result.r = Math.round(highlights.r*val + shadows.r*(1-val))
    final_result.g = Math.round(highlights.g*val + shadows.g*(1-val))
    final_result.b = Math.round(highlights.b*val + shadows.b*(1-val))
    return final_result
}



