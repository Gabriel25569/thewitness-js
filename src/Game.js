
// cnv.addEventListener('click', function(e) {
//     cnv.requestPointerLock();
//     x = e.clientX - cnv.offsetLeft;
//     y = e.clientY - cnv.offsetTop;
//     cnv.addEventListener('mousemove', function(e) {
//         canvasLoop(e);
//     }, false);
// });

// function canvasLoop(e) {
//     var movementX = e.movementX || 0;
//     var movementY = e.movementY || 0;
  
//     x += movementX;
//     y += movementY;
  
//     //canvasDraw();
  
//     //var animation = requestAnimationFrame(canvasLoop);
    
//     Rectangle(x, y, 5, 5, {radius: [0, 0, 0, 0], width: 0}, {fill: "#FFFFFF" , stroke: "#FFFFFF"}, ctx);
//   }


var Game = {

    init: function(parent, theme) {
        let stage = document.createElement("div");
        let layers = new Array(2);

        for (let i = 0; i < 2; i++)
        {
            let layer = document.createElement("canvas");
            layer.style.zIndex = i;
            layer.style.position = "absolute";
            stage.appendChild(layer);
            layers[i] = layer;
        }
        parent.appendChild(stage);

        Game._stage = stage;

        Game._graphics = new Graphics(layers, theme);

        Game._currentPuzzle = null;
        Game._snake = null;

        // function frame() {
        //     Game._now = Game._timestamp();
        //     Game._dt = Game._dt + Math.min(1, (Game._now - Game._last) / 1000);
        //     while(Game._dt > Game._step) {
        //             Game._dt = Game._dt - Game._step;
        //             Game._update(Game._step);
        //     }
        //     Game._render(Game._dt);
        //     Game._last = Game._now;
        //     requestAnimationFrame(frame);
        // }

        // requestAnimationFrame(frame);
    },

    loadPuzzle : function(puzzle) {
        Game._graphics.drawPuzzle(puzzle);
        Game._stage.style.width = Game._graphics.getWidth();
        Game._stage.style.height = Game._graphics.getHeight();
        //Game._currentPuzzle = puzzle;
    },

    _mouseClick: function(e) {
        this._graphics.lockPointer();
    },

    _update: function() {

    },

    _render: function() {

    },

    _timestamp: function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

}

window.onload = function main() {
    let options = {blockSize: 100, margin: 50, pathSize: 25};
    let puzzle = new Puzzle(3, 3, {}, options);
    let testElement = new Element(ELEMENT_TYPE.HEXAGON, LOCATION_TYPE.BLOCK, {x: 0, y:0})
    puzzle.addElement(testElement);

    let theme = new Theme("#F9B700", "#3B280A", "#FFFFFF");
    let stage = document.getElementById("stage");

    Game.init(document.body, theme);
    Game.loadPuzzle(puzzle);


}
