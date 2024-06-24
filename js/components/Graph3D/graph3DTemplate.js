Template.prototype.graph3DTemplate = () => `<canvas id='canvasGraph3D' class='asg'></canvas>
<div>
    <select id = 'selectFigure'>    
        <option value = 'sphere'>Сфера</option>    
        <option value = 'ellipse'>Эллипс</option>    
        <option value = 'thor'>Тор</option>    
        <option value = 'cube'>Куб</option>
        <option value = 'hyperbolicCylinder'>Гиперболический цилиндр</option>
    <select>
</div>
<div>
    <input class='customSurface' data-custom='drawPoints' type='checkbox' id ='points' checked>Рисовать точки</input>    
    <input class='customSurface' data-custom='drawEdges' type='checkbox' id ='edges' checked>Рисовать рёбра</input>
    <input class='customSurface' data-custom='drawPolygons' type='checkbox' id ='polygons' checked>Рисовать полигоны</input> 
</div>
<div class='frame'>
    <h1>FPS:</h1>
    <h1 id='fps'></h1>
</div>
`;