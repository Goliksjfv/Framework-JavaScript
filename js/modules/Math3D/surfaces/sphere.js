Surfaces.prototype.sphere = ({
    count = 20,
    radius = 10,
    color = '#ff0000',
    x0 = 0,
    y0 = 0,
    z0 = 0 } = {}) => {
    const points = [];
    const edges = [];
    const polygons = []
    // about points
    const thetaDelta = Math.PI / count;
    const phiDelta = (Math.PI * 2) / count;

    for (let theta = 0; theta <= Math.PI; theta += thetaDelta) {
        for (let phi = 0; phi < Math.PI * 2; phi += phiDelta) {
            const x = x0 + radius * Math.sin(theta) * Math.cos(phi);
            const y = y0 + radius * Math.sin(theta) * Math.sin(phi);
            const z = z0 + radius * Math.cos(theta);

            points.push(new Point(x, z, y));
        }
    }

    // anout edges
    for (let i = 0; i < points.length; i++) {
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        } else {
            edges.push(new Edge(i, i + 1 - count));
        }

        if (i + count < points.length) {
            edges.push(new Edge(i, i + count));
        } else {
            edges.push(new Edge(i, i % count));
        }
    }

    for (let i = 0; i < points.length; i++) {
        if (points[i + count + 1]) {
            polygons.push(new Polygon([
                i,
                i + 1,
                i + count + 1,
                i + count
            ], color));
        }
    }


    return new Surface(points, edges, polygons, new Point(x0, y0, z0));
}
