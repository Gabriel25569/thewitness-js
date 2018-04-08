class Graphics {

    constructor(layers, options, theme) {
        this._stage = document.createElement("div");

        parent.appendChild(this._stage);


        this._pathSize = options.pathSize;
        this._blockSize = options.blockSize;
        this._margin = options.margin;

        this._options = options;
        this._theme = theme;
    }

    drawPuzzle(puzzle) {
        let margin = this._options.margin;
        let pathSize = this._options.pathSize;
        let blockSize = this._options.blockSize;
        
        let width = 2 * margin + puzzle.Rows * blockSize + ((puzzle.Rows + 1) * pathSize);
        let height = 2 * margin + puzzle.Columns * blockSize + ((puzzle.Columns + 1) * pathSize);

        // Configure stage
        this._stage.style.width = width;
        this._stage.style.height = height;

        this._bgLayer.width = width;
        this._bgLayer.height = height;

        this._gameLayer.width = width - 2 * margin;
        this._gameLayer.height = height - 2 * margin;
        this._gameLayer.style.top = margin;
        this._gameLayer.style.left = margin;

        this._snakeLayer.width = width - 2 * margin;
        this._snakeLayer.height = height - 2 * margin;
        this._snakeLayer.style.top = margin;
        this._snakeLayer.style.left = margin;

        let bgCtx = this._bgLayer.getContext("2d");
        let gameCtx = this._gameLayer.getContext("2d");

        // Game background
        this._drawRectangle(0, 0, this._bgLayer.width, this._bgLayer.height, 
                            {radius: [0, 0, 0, 0], width: 0}, 
                            {fill: this._theme.Background , stroke: "#000000"}, 
                            bgCtx
                           );
        
        // Puzzle Background
        this._drawRectangle(0, 0, this._gameLayer.width, this._gameLayer.height, 
                            {radius: [8, 8, 8, 8], width: 0}, 
                            {fill: this._theme.Path , stroke: this._theme.Path}, 
                            gameCtx
                           );

        // Puzzle blocks
        for (let i = 0; i < puzzle.Rows; i++) {
            for (let j = 0; j < puzzle.Columns; j++) {
                this._drawRectangle(i * blockSize + ((i+1) * pathSize), 
                                    j * blockSize + ((j+1) * pathSize), 
                                    blockSize, blockSize, 
                                    {radius: [0, 0, 0, 0], width: 0}, 
                                    {fill: "#F9B700" , stroke: "#F9B700"}, 
                                    gameCtx
                                   );
            }
        }

        // Draw puzzle elements
    }

    drawSnake(snake) {

    }

    lockPointer() {
        this._gameLayer.requestPointerLock();
    }

    // Border 
    // -> radius: [tl, tr, bl, br]
    // -> width: int
    // Style  
    // -> fill: string (color)
    // -> stroke: string (color)
    _drawRectangle(x, y, w, h, border, style, ctx) {
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

    _drawCircle(x, y, r, fillStyle) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI)
        ctx.closePath();
        
        ctx.fillStyle = fillStyle;

        ctx.fill();
        ctx.stroke();
    }
}