Surfaces.prototype.hyperbolicCylinder = ({ count = 20, a = 10, b = 10 }) => {
    const points = [];
    const edges = [];
    const polygons = [];

    for (let i = 0; i < count; i++) {
        const u = (i / (count - 1) - 0.5) * Math.PI;

        for (let j = 0; j < count; j++) {
            const v = (j / (count - 1)) * Math.PI * 2;

            const x = a * Math.cosh(u) * Math.cos(v);
            const y = a * Math.cosh(u) * Math.sin(v);
            const z = b * u;

            points.push(new Point(x, y, z));

            if (i > 0) {
                edges.push(new Edge((i - 1) * count + j, i * count + j));
            }
            if (j > 0) {
                edges.push(new Edge(i * count + j - 1, i * count + j));
            }
        }
    }

    for (let i = 0; i < count - 1; i++) {
        for (let j = 0; j < count - 1; j++) {
            const index1 = i * count + j;
            const index2 = i * count + j + 1;
            const index3 = (i + 1) * count + j + 1;
            const index4 = (i + 1) * count + j;

            polygons.push(new Polygon([index1, index2, index3, index4], '#993333'));
        }
    }

    return new Surface(points, edges, polygons);
};
