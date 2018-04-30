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
        Game._graphics.drawPuzzle();
        Game._puzzle = puzzle;
        Game._snake = null;

        Game._stage.style.width = Game._graphics.width;
        Game._stage.style.height = Game._graphics.height;
    },

    _mouseClick: function (e) {
        let x = e.clientX - Game._canvas.offsetLeft;
        let y = e.clientY - Game._canvas.offsetTop;

        for (let i = 0; i < Game._puzzle.nodes.length; i++) {
            let rect = Game._puzzle.findNode(i).rect;
            if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h &&
                Game._puzzle.findNode(i).element == NODE_ELEMENT_TYPE.START) {   
                    Game._canvas.requestPointerLock();
                    Game._snake = new Snake(i);
        
                    Game._canvas.addEventListener("mousemove", Game._mouseMove, false);
                    document.addEventListener("pointerlockchange", Game._mouseExit, false);
                    Game._canvas.removeEventListener("click", Game._mouseClick, false);
        
                    Game._graphics.drawSnake(Game._snake);
            }
        }
    },

    _mouseExit: function (e) {
        if (document.pointerLockElement != Game._canvas) {
            // Game._snake = null;

            // Game._canvas.removeEventListener("mousemove", Game._mouseMove, false);
            // document.removeEventListener("pointerlockchange", Game._mouseExit, false);
            // Game._canvas.addEventListener("click", Game._mouseClick, false);
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
                Game._snake.stack.length != 1) {
                    let last = Game._snake.pop();
    
                    Game._nextNodeIndex = last.index;
                    Game._snake.direction = last.direction;
    
                    if (Game._snake.direction == DIRECTION.BOTTOM || Game._snake.direction == DIRECTION.RIGHT) {
                        Game._snake.movement = lineSize;
                    } else {
                        Game._snake.movement = -lineSize;
                    }
            } else {
                let node = Game._puzzle.findNode(Game._snake.lastNode).neighbors[direction];
                if (node != undefined) {
                    Game._nextNodeIndex = node;
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
            if (Game._snake.stack[0] == Game._nextNodeIndex) {
                blockSize -= Math.floor(START_RADIUS * pathSize) - pathSize / 2;
            }

            // Check if next node was already passed by the snake
            if (Math.abs(Game._snake.movement + movement) > blockSize) {
                if (Game._snake.stack.includes(Game._nextNodeIndex) && Game._snake.lastNode != Game._nextNodeIndex) {
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
                Game._snake.push(Game._nextNodeIndex);

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
};