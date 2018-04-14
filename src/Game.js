var Game = {
    init: function (parent, theme) {
        let stage = document.createElement("div");
        let layers = new Array(2);

        for (let i = 0; i < 2; i++) {
            let layer = document.createElement("canvas");
            layer.style.zIndex = i;
            layer.style.position = "absolute";
            stage.appendChild(layer);
            layers[i] = layer;
        }

        parent.appendChild(stage);

        Game._stage = stage;

        Game._canvas = layers[1];
        Game._canvas.addEventListener("click", Game._mouseClick, false);

        Game._graphics = new Graphics(layers, theme);
        Game._currentPuzzle = null;
        setInterval(Game._render, 1000/60)
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

    loadPuzzle : function (puzzle) {
        Game._graphics.setPuzzle(puzzle);
        Game._puzzle = puzzle;
        Game._snake = null;

        Game._stage.style.width = Game._graphics.width;
        Game._stage.style.height = Game._graphics.height;
    },

    _mouseClick: function (e) {
        let x = e.clientX - Game._canvas.offsetLeft;
        let y = e.clientY - Game._canvas.offsetTop;

        let startIndex = Game._puzzle.getStartNode(x, y);
        if (startIndex != -1) {
            Game._canvas.requestPointerLock();
            Game._snake = new Snake(startIndex);

            Game._canvas.addEventListener('mousemove', Game._mouseMove, false);
            document.addEventListener('pointerlockchange', Game._mouseExit, false);
            Game._canvas.removeEventListener("click", Game._mouseClick, false);

            Game._graphics.drawSnake(Game._snake);
        }
    },

    _mouseExit: function (e) {
        if (document.pointerLockElement != Game._canvas) {
            Game._snake = null;

            Game._graphics.clearSnake();

            Game._canvas.removeEventListener('mousemove', Game._mouseMove, false);
            document.removeEventListener('pointerlockchange', Game._mouseExit, false);
            Game._canvas.addEventListener("click", Game._mouseClick, false);
        }
    },

    _mouseMove: function (e) {
        let mx = Math.floor(e.movementX) || 0;
        let my = Math.floor(e.movementY) || 0;
        let movement = 0;

        let pathSize = Game._puzzle.options.pathSize;
        let blockSize = Game._puzzle.options.blockSize;
        let lineSize = pathSize + blockSize;

        if (Game._snake.direction == DIRECTION.NONE) {
            let direction;
            let movement;
            if (Math.abs(mx) > Math.abs(my)) {
                if (mx > 0) {
                    way = NODE_WAY.RIGHT;
                    direction = DIRECTION.RIGHT;
                } else {
                    way = NODE_WAY.LEFT;
                    direction = DIRECTION.LEFT;
                }
                movement = mx;
            } else {
                if (my > 0) {
                    way = NODE_WAY.BOTTOM;
                    direction = DIRECTION.BOTTOM;
                } else {
                    way = NODE_WAY.TOP;
                    direction = DIRECTION.TOP;
                }
                movement = my;
            }
            
            if ((direction == DIRECTION.TOP && Game._snake.lastDirection == DIRECTION.BOTTOM) || 
                (direction == DIRECTION.RIGHT && Game._snake.lastDirection == DIRECTION.LEFT) ||
                (direction == DIRECTION.BOTTOM && Game._snake.lastDirection == DIRECTION.TOP) ||
                (direction == DIRECTION.LEFT && Game._snake.lastDirection == DIRECTION.RIGHT) &&
                Game._snake.nodeStack.length != 1) {
                    let last = Game._snake.popNode();
    
                    Game._nextNode = last.node;
                    Game._snake.direction = last.direction;
    
                    if (Game._snake.direction == DIRECTION.BOTTOM || Game._snake.direction == DIRECTION.RIGHT) {
                        Game._snake.movement = lineSize;
                    } else {
                        Game._snake.movement = -lineSize;
                    }

                    //Game._graphics.drawSnake(Game._snake);
            } else if (Game._puzzle.getNodeWays(Game._snake.lastNode).includes(way)) {
                Game._nextNode = Game._puzzle.getNodeNeighbor(Game._snake.lastNode, way);
                Game._snake.direction = direction;
            }
        } else {
            let movement;
            if (Game._snake.direction == DIRECTION.RIGHT) {
                if (Game._snake.movement < lineSize / 2) {
                    movement = mx - Math.abs(my / 2);
                } else {
                    movement = mx + Math.abs(my / 2);
                }
            }
            else if (Game._snake.direction == DIRECTION.LEFT) {
                if (Math.abs(Game._snake.movement) < lineSize / 2) {
                    movement = mx + Math.abs(my / 2);
                } else {
                    movement = mx - Math.abs(my / 2);
                }
            }
            else if (Game._snake.direction == DIRECTION.BOTTOM) {
                if (Game._snake.movement < lineSize / 2) {
                    movement = my - Math.abs(mx / 2);
                } else {
                    movement = my + Math.abs(mx / 2);
                }
            }
            else if (Game._snake.direction == DIRECTION.TOP) {
                if (Math.abs(Game._snake.movement) < lineSize / 2) {
                    movement = my + Math.abs(mx / 2);
                } else {
                    movement = my - Math.abs(mx / 2);
                }
            }

            // Check if the snake is on the next node
            if (Math.abs(Game._snake.movement + movement) > blockSize) {
                if (Game._snake.nodeStack.includes(Game._nextNode) && Game._snake.lastNode != Game._nextNode) {
                    if (Game._snake.direction == DIRECTION.BOTTOM || Game._snake.direction == DIRECTION.RIGHT) {
                        Game._snake.movement = blockSize;
                    } else {
                        Game._snake.movement = -blockSize;
                    }
    
                    //Game._graphics.drawSnake(Game._snake);
                    return;
                }
            }

            // Check if snake passed a node
            if (Math.abs(Game._snake.movement + movement) > lineSize) {
                Game._snake.pushNode(Game._nextNode);

                Game._snake.movement = 0;
                Game._snake.direction = DIRECTION.NONE;
                
                //Game._graphics.drawSnake(Game._snake);
                return;
            } 

            // Check if snake is coming back
            if (((Game._snake.direction == DIRECTION.BOTTOM || Game._snake.direction == DIRECTION.RIGHT) && Game._snake.movement + movement < 0) ||
                ((Game._snake.direction == DIRECTION.TOP || Game._snake.direction == DIRECTION.LEFT) && Game._snake.movement + movement > 0)) {
                Game._snake.direction = DIRECTION.NONE;
                Game._snake.movement = 0;
                //Game._graphics.drawSnake(Game._snake);
                return;
            } 
            
            Game._snake.move(movement);
        } 
    },

    _update: function () {

    },

    _render: function () {
        if (Game._snake != null) {
            Game._graphics.drawSnake(Game._snake);
        }
    },
}