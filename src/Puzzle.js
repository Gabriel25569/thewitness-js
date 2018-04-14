class Puzzle {

    constructor (rows, columns, elements, options) {
        if (rows < 1)
            throw "Invalid value for puzzle rows";

        if (columns < 1)
            throw "Invalid value for puzzle columns";

        this._rows = rows;
        this._columns = columns;
        this._options = options;

        this._nodeElements = new Array(rows * columns);

        this._edgeElements = new Array(rows * columns);
        for (let i = 0; i < rows * columns; i++)
            this._edgeElements[i] = new Array(rows * columns);

        this._blockElements = new Array(rows);
        for (let i = 0; i < rows; i++)
            this._blockElements[i] = new Array(columns);


        for (let i = 0; i < elements.length; i++) {
            this.addElement(elements[i]);
        }
    }

    // Add element to puzzle
    addElement (element) {
        let location = element.location;
        switch (element.locationType) {
            case LOCATION_TYPE.NODE:
                this._nodeElements[location.x] = element;
                break;
            case LOCATION_TYPE.EDGE:
                this._edgeElements[location.x][location.y] = element;
                this._edgeElements[location.y][location.x] = element;
            case LOCATION_TYPE.BLOCK:
                this._blockElements[location.x][location.y] = element;
                break;
            default:
                throw "Puzzle with invalid element location type";
        }
    }

    // Get node screen coordinates from index
    getNodeCoordinate (i) {
        let margin = this._options.margin;
        let blockSize = this._options.blockSize;
        let pathSize = this._options.pathSize;

        let x = margin + i % (this.columns + 1) * blockSize + i % (this.columns + 1) * pathSize + pathSize / 2;
        let y = margin + Math.floor(i / (this.columns + 1)) * blockSize + Math.floor(i / (this.columns + 1)) * pathSize + pathSize / 2;

        return {x: Math.floor(x), y: Math.floor(y)};
    }

    // Get node index based on screen coordinates (col)
    getNode (x, y) {
        let pathSize = this._options.pathSize;

        for (let i = 0; i < this._nodeElements.length; i++) {
            let nodeCoord = this.getNodeCoordinate(i);

            let rx = nodeCoord.x - pathSize / 2;
            let ry = nodeCoord.y - pathSize / 2;
            let rw = pathSize;
            let rh = pathSize;

            // Collision with node "rectangle"
            if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) {   
                return i;
            }
        }

        return null;
    }

    // Get start node index from coordinate (or -1 if not found)
    getStartNode (x, y) {
        let startNodes = new Array();
        for (let i = 0; i < this._nodeElements.length; i++) {
            if (this._nodeElements[i] != null && this._nodeElements[i].type == NODE_ELEMENT_TYPE.START) {
                startNodes.push(i);
            }
        }

        for (let i = 0; i < startNodes.length; i++) {
            let coord = this.getNodeCoordinate(startNodes[i]);

            let cx = coord.x;
            let cy = coord.y;

            let dx = x - cx;
            let dy = y - cy;
            let d = Math.sqrt((dx * dx) + (dy * dy));

            if (d <= Math.floor(START_RADIUS * this._options.pathSize)) {
                return startNodes[i];
            }
        }

        return -1;
    }

    // Get node ways (TOP, RIGHT, BOTTOM, LEFT) from index
    getNodeWays (i) {
        let x = i % (this.columns + 1);
        let y = Math.floor(i / (this.columns + 1));

        let nodeWays = new Array();

        if (x - 1 >= 0)
            nodeWays.push(NODE_WAY.LEFT);

        if (y - 1 >= 0)
            nodeWays.push(NODE_WAY.TOP);

        if (x + 1 <= this.columns)
            nodeWays.push(NODE_WAY.RIGHT);

        if (y + 1 <= this.rows)
            nodeWays.push(NODE_WAY.BOTTOM);

        return nodeWays;
    }

    getNodeNeighbor (node, way) {
        let ways = this.getNodeWays(node)

        if (ways.includes(way)) {
            switch (way) {
                case NODE_WAY.TOP:
                    return node - this.columns - 1;
                    break;
                case NODE_WAY.RIGHT:
                    return node + 1;
                    break;
                case NODE_WAY.BOTTOM:
                    return node + this.columns + 1;
                    break;
                case NODE_WAY.LEFT:
                    return node - 1;
                    break;
            }
        } else {
            return null;
        }
    }

    // _iToXy (i) {
    //     let x = i % (this.columns + 1);
    //     let y = Math.floor(i / (this.columns + 1));
    //     return {x: x, y: y};
    // }
    //
    // _xyToI (x, y) {
    //     return x * this._columns + y;
    // }

    get rows () {
        return this._rows;
    }

    get columns () {
        return this._columns;
    }

    get options () {
        return this._options;
    }

    get nodeElements () {
        return this._nodeElements;
    }

    get edgeElements () {
        return this._edgeElements;
    }

    get blockElements () {
        return this._blockElements
    }
}
