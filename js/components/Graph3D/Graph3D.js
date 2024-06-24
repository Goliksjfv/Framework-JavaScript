window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequesAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

class Graph3D extends Component {
    constructor(options) {
        super(options);
        const WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20,
            CENTER: new Point(0, 0, -30),
            CAMERA: new Point(0, 0, -50)
        }
        this.graph = new Graph({
            id: 'canvasGraph3D', width: 600, height: 600, WIN,
            callbacks: {
                wheel: (event) => this.wheel(event),
                mousemove: (event) => this.mousemove(event),
                mouseup: () => this.mouseup(),
                mousedown: () => this.mousedown(),
            }
        });
        this.math3D = new Math3D({ WIN });
        this.surfaces = new Surfaces;
        this.scene = this.SolarSystem();
        this.WIN = WIN;
        this.LIGHT = new Light(30, 15, 20, 1500);

        this.drawPoints = true;
        this.drawEdges = true;
        this.drawPolygons = true;

        setInterval(() => {
            this.scene.forEach(surface => surface.doAnimation(this.math3D));
        }, 50);

        let FPS = 0;
        let countFPS = 0;
        let timestamp = Date.now();

        const renderLoop = () => {
            countFPS++;
            const currentTimestamp = Date.now();
            if (currentTimestamp - timestamp >= 1000) {
                FPS = countFPS;
                countFPS = 0;
                timestamp = currentTimestamp;
            }
            this.renderScene(FPS);
            requestAnimFrame(renderLoop);
        }

        renderLoop();
    }

    changeStyle() {
        document.querySelector('body').style.backgroundColor = 'white';
        document.querySelector('body').style.overflow = 'hidden';
    }

    addEventListeners() {
        document.getElementById('show3D').addEventListener(
            'click',
            () => this.changeStyle()
        );
        document.getElementById('selectFigure').addEventListener(
            'change',
            () => this.selectFigure()
        );
        document.querySelectorAll('.customSurface').forEach(checkbox =>
            checkbox.addEventListener(
                'change',
                (event) => {
                    this[event.target.dataset.custom] = event.target.checked;

                }
            )
        );
    }

    mouseup() {
        this.canMove = false;
    }

    mousedown() {
        this.canMove = true;
    }

    wheel(event) {
        event.preventDefault();
        const delta = (event.wheelDelta > 0) ? 1.2 : 0.8;
        const matrix = this.math3D.zoom(delta);
        this.scene.forEach(surface =>
            surface.points.forEach(point => this.math3D.transform(matrix, point))
        );
    }

    mousemove(event) {
        if (this.canMove) {
            const gradus = Math.PI / 180 / 4;
            const T1 = this.math3D.rotateOx((this.dy - event.offsetY) * gradus);
            const T2 = this.math3D.rotateOy((this.dx - event.offsetX) * gradus);
            const matrix = this.math3D.getTransform(T1, T2);
            this.scene.forEach(surface =>
                surface.points.forEach(point => this.math3D.transform(matrix, point))
            );

        }
        this.dx = event.offsetX;
        this.dy = event.offsetY;
    }

    selectFigure() {
        const figure = document.getElementById('selectFigure').value;
        this.scene = [this.surfaces[figure]({})];
    }

    SolarSystem() {
        const Earth = this.surfaces.sphere({ color: '#ffff00' });
        Earth.addAnimation('rotateOy', 0.1);
        const Moon = this.surfaces.sphere({ radius: 5, x0: 16 });
        Moon.addAnimation('rotateOz', 0.2);
        Moon.addAnimation('rotateOy', 0.05, Earth.center);
        return [Earth, Moon];
    }

    renderScene(FPS) {
        this.graph.clear();
        if (this.drawPolygons) {
            const polygons = [];
            this.scene.forEach((surface, index) => {
                this.math3D.calcDistance(surface, this.WIN.CAMERA, 'distance');
                this.math3D.calcDistance(surface, this.LIGHT, 'lumen');
                this.math3D.calcCenter(surface);
                this.math3D.calcRadius(surface);
                this.math3D.calcVisibility(surface, this.WIN.CAMERA);
                surface.polygons.forEach(polygon => {
                    polygon.index = index;
                    polygons.push(polygon);
                });
            });

            this.math3D.sortByArtistAlgorithm(polygons);

            polygons.forEach(polygon => {
                if(polygon.visibility)
                {const points = polygon.points.map(index =>
                    new Point(
                        this.math3D.xs(this.scene[polygon.index].points[index]),
                        this.math3D.ys(this.scene[polygon.index].points[index])
                    )
                );
                const { isShadow, dark } = this.math3D.calcShadow(polygon, this.scene, this.LIGHT);
                const lumen = this.math3D.calcIllumination(polygon.lumen, this.LIGHT.lumen * (isShadow ? dark : 1));
                let { r, g, b } = polygon.color;
                r = Math.round(r * lumen);
                g = Math.round(g * lumen);
                b = Math.round(b * lumen);
                this.graph.polygon(points, polygon.rgbToHex(r, g, b));}
            });
        }
        if (this.drawPoints) {
            this.scene.forEach(surface =>
                surface.points.forEach(
                    point => this.graph.point(
                        this.math3D.xs(point),
                        this.math3D.ys(point)
                    )
                )
            );
        }
        if (this.drawEdges) {
            this.scene.forEach(surface =>
                surface.edges.forEach(edge => {
                    const point1 = surface.points[edge.p1];
                    const point2 = surface.points[edge.p2];
                    this.graph.line(
                        this.math3D.xs(point1), this.math3D.ys(point1),
                        this.math3D.xs(point2), this.math3D.ys(point2)
                    );
                })
            );
        }
        this.graph.renderFrame();
    }
}