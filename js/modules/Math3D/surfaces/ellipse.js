Surfaces.prototype.ellipse = ({ count = 20, a = 10, b = 5 }) => {
    const points = [];
    const edges = [];
    const polygons = [];
    // about points
    const da = Math.PI * 2 / count;
    for (let phi = 0; phi < Math.PI * 2; phi += da) {
        for (let psi = -Math.PI; psi < Math.PI; psi += da) {
            const x = a * Math.cos(phi);
            const y = b * Math.sin(phi) * Math.cos(psi);
            const z = b * Math.sin(phi) * Math.sin(psi);
            points.push(new Point(y, x, z));
        }
    }
    // about edges
    for (let i = 0; i < points.length; i++) {
        if (points[i + 1]) {
            if ((i + 1) % count === 0) {
                edges.push(new Edge(i, i + 1 - count));
            } else {
                edges.push(new Edge(i, i + 1));
            }
        }
        if (points[i + count]) {
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
            ], '#993333'));
        }
    }
    return new Surface(points, edges, polygons);
}
