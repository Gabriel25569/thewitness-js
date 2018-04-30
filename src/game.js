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


        // JS STATS ///////////////////////////
        Game._stats = new Stats();           //
        Game._stats.showPanel(0);            //
        parent.appendChild(Game._stats.dom); //
        ///////////////////////////////////////

        requestAnimationFrame(Game._render);
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

            Game._lastMove = Date.now();
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

            if (Math.abs(mx) > Math.abs(my)) {
                if (mx > 0) {
                    direction = DIRECTION.RIGHT;
                } else {
                    direction = DIRECTION.LEFT;
                }
                movement = mx;
            } else {
                if (my > 0) {
                    direction = DIRECTION.BOTTOM;
                } else {
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
            } else {
                let node = Game._puzzle.getNodeNeighbor(Game._snake.lastNode, direction);
                if (node != null) {
                    Game._nextNode = node;
                    Game._snake.direction = direction;
                }
            }
        } else {
            // Adjust x / y movements
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
            
            // If the next node is the start node
            if (Game._snake.nodeStack[0] == Game._nextNode) {
                blockSize -= Math.floor(START_RADIUS * pathSize) - pathSize / 2;
            }

            // Check if next node was already passed by the snake
            if (Math.abs(Game._snake.movement + movement) > blockSize) {
                if (Game._snake.nodeStack.includes(Game._nextNode) && Game._snake.lastNode != Game._nextNode) {
                    if (Game._snake.direction == DIRECTION.BOTTOM || Game._snake.direction == DIRECTION.RIGHT) {
                        Game._snake.movement = blockSize;
                    } else {
                        Game._snake.movement = -blockSize;
                    }
    
                    return;
                }
            }

            // Check if snake passed a node with this movement
            if (Math.abs(Game._snake.movement + movement) > lineSize) {
                Game._snake.pushNode(Game._nextNode);

                Game._snake.movement = 0;
                Game._snake.direction = DIRECTION.NONE;
                
                return;
            } 

            // Check if snake is coming back
            if (((Game._snake.direction == DIRECTION.BOTTOM || Game._snake.direction == DIRECTION.RIGHT) && Game._snake.movement + movement < 0) ||
                ((Game._snake.direction == DIRECTION.TOP || Game._snake.direction == DIRECTION.LEFT) && Game._snake.movement + movement > 0)) {
                Game._snake.direction = DIRECTION.NONE;
                Game._snake.movement = 0;
                return;
            } 
            
            Game._snake.move(movement);
        } 

    },
    
    _render: function () {
        Game._stats.begin();

        if (Game._snake != null) {
            Game._graphics.drawSnake(Game._snake);
        }

        Game._stats.end();
        
        requestAnimationFrame(Game._render);
    },
}