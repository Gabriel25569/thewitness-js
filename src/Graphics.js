class Graphics {

    constructor (layers, theme) {
        this._puzzleLayer = layers[0];
        this._snakeLayer = layers[1];

        this._width = 0;
        this._height = 0;

        this._theme = theme;
    }

    setPuzzle (puzzle) {
        this.clearSnake();

        let margin = puzzle.options.margin;
        let pathSize = puzzle.options.pathSize;
        let blockSize = puzzle.options.blockSize;
        let rows = puzzle.rows;
        let columns = puzzle.columns;

        let width = 2 * margin + columns * blockSize + ((columns + 1) * pathSize);
        let height = 2 * margin + rows * blockSize + ((rows + 1) * pathSize);

        this._puzzle = puzzle;

        this._width = width;
        this._height = height;

        this._puzzleLayer.width = width;
        this._puzzleLayer.height = height;

        this._snakeLayer.width = this._width;
        this._snakeLayer.height = this._height;

        let ctx = this._puzzleLayer.getContext("2d");

        // Game background
        this._drawRectangle(0, 0, width, height,
                            {radius: [0, 0, 0, 0], width: 0},
                            {fill: this._theme.background , stroke: "#000000"},
                            ctx
                           );


        // Puzzle Background
        this._drawRectangle(margin, margin, width - 2 * margin, height - 2 * margin,
                            {radius: [pathSize / 2, pathSize / 2, pathSize / 2, pathSize / 2], width: 0},
                            {fill: this._theme.path , stroke: this._theme.path},
                            ctx
                           );

        // Puzzle blocks
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {

                this._drawRectangle(margin + i * blockSize + ((i+1) * pathSize),
                                    margin + j * blockSize + ((j+1) * pathSize),
                                    blockSize, blockSize,
                                    {radius: [0, 0, 0, 0], width: 0},
                                    {fill: this._theme.background , stroke: this._theme.background},
                                    ctx
                                   );
                //if (puzzle.blocks[i][j] != null)
                //{
                    // Draw block elements
                //}
            }
        }

        // Nodes
        for (let i = 0; i < puzzle.nodeElements.length; i++) {
            if (puzzle.nodeElements[i] != null) {
                switch (puzzle.nodeElements[i].type) {
                    case NODE_ELEMENT_TYPE.START:
                        let coord = puzzle.getNodeCoordinate(i);
                        this._drawCircle(coord.x, coord.y, Math.floor(START_RADIUS * pathSize),
                                         this._theme.path,
                                         ctx)
                        break;
                }
            }
        }

        // Draw node and edge elements
    }

    drawSnake (snake) {
        this.clearSnake();
        if (snake != null) {
            let pathSize = this._puzzle.options.pathSize;
            let ctx = this._snakeLayer.getContext("2d");


            let coord = this._puzzle.getNodeCoordinate(snake.nodeStack[0]);

            this._drawCircle(coord.x, coord.y, Math.floor(START_RADIUS * pathSize),
                             this._theme.snake,
                             ctx);

            let lastNode = snake.nodeStack[0];
            let node = null;

            // Draw all the lines (except the last one)
            for (let i = 1; i < snake.nodeStack.length; i++) {
                node = snake.nodeStack[i];

                let lastCoord = this._puzzle.getNodeCoordinate(lastNode);
                coord = this._puzzle.getNodeCoordinate(node);

                this._drawLine(lastCoord.x, lastCoord.y, coord.x, coord.y, this._theme.snake, pathSize, ctx);

                lastNode = node;
            }

            // Draw the last line
            if (snake.direction == DIRECTION.TOP || snake.direction == DIRECTION.BOTTOM) {
                this._drawLine(coord.x, coord.y, coord.x, coord.y + snake.movement, this._theme.snake, pathSize, ctx);
            } else if (snake.direction == DIRECTION.LEFT || snake.direction == DIRECTION.RIGHT) {
                this._drawLine(coord.x, coord.y, coord.x + snake.movement, coord.y, this._theme.snake, pathSize, ctx);
            }
        }
    }

    clearSnake () {
        let ctx = this._snakeLayer.getContext("2d");
        ctx.clearRect(0, 0, this.width, this.height);
    }

    // Border
    // -> radius: [tl, tr, bl, br]
    // -> width: int
    // Style
    // -> fill: string (color)
    // -> stroke: string (color)
    _drawRectangle (x, y, w, h, border, style, ctx) {
        let nw = x + w;
        let nh = y + h;

        let br = 0;
        if (border.radius)
            br = {tl: border.radius[0], tr: border.radius[1], br: border.radius[2], bl: border.radius[3]};
        else
            br = {tl: 0, tr: 0, br: 0, bl:0};

        ctx.beginPath();

        ctx.moveTo(x, y + br.tl);
        ctx.arc(x + br.tl, y + br.tl, br.tl, Math.PI, Math.PI * 1.5);
        ctx.lineTo(nw - br.tr, y);
        ctx.arc(nw - br.tr, y + br.tr, br.tr, Math.PI * 1.5, 0);
        ctx.lineTo(nw, nh - br.br);
        ctx.arc(nw - br.br, nh - br.br, br.br, 0, Math.PI * 0.5);
        ctx.lineTo(x + br.tl, nh);
        ctx.arc(x + br.bl, nh - br.bl, br.bl, Math.PI * 0.5, Math.PI);
        ctx.lineTo(x, y + br.tl);

        ctx.closePath();

        ctx.fillStyle = style.fill;
        ctx.fill();

        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = border.width;
        ctx.stroke();
    }

    _drawCircle (x, y, r, fillStyle, ctx) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI)
        ctx.closePath();

        ctx.fillStyle = fillStyle;

        ctx.fill();
        ctx.fill();
    }

    _drawLine (x1, y1, x2, y2, style, width, ctx)
    {
        ctx.beginPath();
        ctx.lineCap="round";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = width;
        ctx.strokeStyle = style;
        ctx.stroke();
        ctx.stroke();
        ctx.stroke();
        ctx.stroke();
        ctx.stroke();

    }

    get width ()
    {
        return this._width;
    }

    get height ()
    {
        return this._height;
    }
}
