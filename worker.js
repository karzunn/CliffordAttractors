self.onmessage = function(event) {

    let X = [event.data.x];
    let Y = [event.data.y];
    let a=event.data.a;
    let b=event.data.b;
    let c=event.data.c;
    let d=event.data.d;
    let x_dim=event.data.width;
    let y_dim=event.data.height;
    let xscale=(x_dim)*0.8-1;
    let yscale=(y_dim)*0.8-1;
    let iters=event.data.iters;

    var empty = [];
    for(var i = 0; i < (x_dim*y_dim*4); i++){
        empty.push(0);
    }

    for (let i=0;i<iters;i++)
        {
        X.unshift(Math.sin(a*Y[0])+c*Math.cos(a*X[0]))
        Y.unshift(Math.sin(b*X[1])+d*Math.cos(b*Y[0]))
        }

    let x_max = getMax(X);
    let x_min = getMin(X);
    let y_max = getMax(Y);
    let y_min = getMin(Y);

    let xx;
    let yy;

    for (let i = 0; i < X.length; i++) {
        xx=Math.round((xscale*(X[i]-x_min)/(x_max-x_min)) + x_dim/10);
        yy=Math.round((yscale*(Y[i]-y_min)/(y_max-y_min)) + y_dim/10);
        empty[xx*4+yy*x_dim*4]+=1;
        empty[xx*4+yy*x_dim*4+1]+=1;
        empty[xx*4+yy*x_dim*4+2]+=1;
    };

    self.postMessage(empty);
}


function getMax(arr) {
    return arr.reduce((max, v) => max >= v ? max : v, -Infinity);
}

function getMin(arr) {
    return arr.reduce((min, v) => min <= v ? min : v, Infinity);
}