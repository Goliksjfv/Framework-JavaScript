function Graph(options) {
    const { id, width = 300, height = 300, WIN, callbacks = {} } = options;
    let canvas;
    if (id) {
        canvas = document.getElementById(id);
    } else {
        canvas = document.createElement('canvas');
        document.querySelector('body').appendChild(canvas);
    }

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    canvas.addEventListener('wheel', callbacks.wheel);
    canvas.addEventListener('mousedown', callbacks.mousedown);
    canvas.addEventListener('mousemove', callbacks.mousemove);
    canvas.addEventListener('mouseup', callbacks.mouseup);
    canvas.addEventListener('mouseleave', callbacks.mouseleave);
    canvas.addEventListener('mousemove', callbacks.getX);

    this.canvasV = document.createElement('canvas');
    this.canvasV.width = width;
    this.canvasV.height = height;
    const contextV = this.canvasV.getContext('2d');
    //x
    const xs = (x) => ((x - WIN.LEFT) / WIN.WIDTH) * canvas.width;

    //y
    const ys = (y) => (WIN.HEIGHT - (y - WIN.BOTTOM)) * canvas.width / WIN.HEIGHT;

    //xs
    this.sx = x => x * WIN.WIDTH / canvas.width + WIN.LEFT;

    //ys
    this.sy = y => -y * WIN.HEIGHT / canvas.height - WIN.BOTTOM;

    this.clear = () => {
        contextV.fillStyle = 'white';
        contextV.fillRect(0, 0, canvas.width, canvas.height)
    }

    this.line = (x1, y1, x2, y2, color, width) => {

        contextV.beginPath();
        contextV.strokeStyle = color || 'black';
        contextV.lineWidth = width || 0;
        contextV.moveTo(xs(x1), ys(y1));
        contextV.lineTo(xs(x2), ys(y2));
        contextV.stroke();
        contextV.closePath();
    }

    this.point = (x, y, color = 'black', size = 2) => {
        contextV.beginPath();
        contextV.strokeStyle = color;
        contextV.fillStyle = color;
        contextV.arc(xs(x), ys(y), size, 0, 2 * Math.PI);
        contextV.stroke();
        contextV.fill();
        contextV.closePath();
    }

    this.print = (x, y, text, color, size) => {
        contextV.font = size / WIN.WIDTH + "px Verdana";
        contextV.fillStyle = color;
        contextV.fillText(text, xs(x), ys(y));
        contextV.stroke;
    }

    this.dashedLine = (x1, y1, x2, y2, color, width) => {
        contextV.beginPath();
        contextV.setLineDash([20, 5]);
        contextV.strokeStyle = color || 'black';
        contextV.lineWidth = width || 0;
        contextV.moveTo(xs(x1), ys(y1));
        contextV.lineTo(xs(x2), ys(y2));
        contextV.stroke();
        contextV.closePath();
        contextV.setLineDash([0, 0]);
    }

    this.polygon = function (points, color = '#f805') {
        contextV.fillStyle = color;
        contextV.beginPath();
        contextV.moveTo(xs(points[0].x), ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            contextV.lineTo(xs(points[i].x), ys(points[i].y));
        }
        contextV.lineTo(xs(points[0].x), ys(points[0].y));
        contextV.closePath();
        contextV.fill();
    }

    this.renderFrame = function () {
        context.drawImage(this.canvasV, 0, 0);
    }
}

