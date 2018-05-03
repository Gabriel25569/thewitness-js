class Node {
    
    constructor (i, x, y) {
        this._i = i;
        this.x = x;
        this.y = y;
        this._neighbors = new Array(4);
    }

    set x (x) {
        this._x = x;
    }

    set y (y) {
        this._y = y;
    }

    set rect (rect) {
        this._rect = rect;
    }

    set element (element) {
        this._element = element;
    }

    get i () {
        return this._i;
    }

    get x () {
        return this._x;
    }

    get y () {
        return this._y;
    }

    get element () {
        return this._element;
    }

    get neighbors () {
        return this._neighbors;
    }
}

class Edge {

    constructor (i1, i2, x, y) {
        this._i1 = i1;
        this._i2 = i2;
        this.x = x;
        this.y = y;
    }
    
    set x (x) {
        this._x = x;
    }

    set y (y) {
        this._y = y;
    }

    set element (element) {
        this._element = element;
    }

    get i1 () {
        return this._i1;
    }

    get i2 () {
        return this._i2;
    }

    get x () {
        return this._x;
    }

    get y () {
        return this._y;
    }

    get element () {
        return this._element;
    }
}

class Block {
    
    constructor (i, x, y, rect) {
        this._i = i;
        this.x = x;
        this.y = y;
    }

    set x (x) {
        this._x = x;
    }

    set y (y) {
        this._y = y;
    }

    set element (element) {
        this._element = element;
    }

    get i () {
        return this._i;
    }

    get x () {
        return this._x;
    }

    get y () {
        return this._y;
    }

    get element () {
        return this._element;
    }

}


class Puzzle {

    constructor (options) {
        this._options = options;

        this._createNodes();
        this._createEdges();
        this._createBlocks();
    }

    addNodeElement (element, location) {
        this.findNode(location).element = element;
    }

    addEdgeElement (element, startNodeLocation, endNodeLocation) {
        this.findEdge(startNodeLocation, endNodeLocation).element = element;
    }

    addBlockElement (element, location) {
        this.findBlock(location).element = element;
    }

    isStart (x, y) {
        for (let i = 0; i < this._nodes.length; i++) {
            if (this._nodes[i].element == NODE_ELEMENT_TYPE.START) {
                let dx = x - this._nodes[i].x;
                let dy = y - this._nodes[i].y;
                let d = Math.sqrt((dx * dx) + (dy * dy));

                if (d <= Math.floor(START_RADIUS * this._options.pathSize)) {
                    return i;
                }
            }
        }

        return undefined;
    }
    
    _createNodes() {
        let nodeCount = (this._options.rows + 1) * (this._options.columns + 1);
        this._nodes = new Array(nodeCount);

        for (let i = 0; i < nodeCount; i++) {
            this._nodes[i] = new Node(
                i,
                this._getNodeXCoordinate(i),
                this._getNodeYCoordinate(i)
            )
            
            // Add node neighbors
            let x = i % (this._options.columns + 1);
            let y = Math.floor(i / (this._options.columns + 1));

            if (y - 1 >= 0)
                this._nodes[i].neighbors[DIRECTION.TOP] = i - this._options.columns - 1;

            if (x + 1 <= this._options.columns)
                this._nodes[i].neighbors[DIRECTION.RIGHT] = i + 1;

            if (y + 1 <= this._options.rows)
                this._nodes[i].neighbors[DIRECTION.BOTTOM] = i + this._options.columns + 1;

            if (x - 1 >= 0)
                this._nodes[i].neighbors[DIRECTION.LEFT] = i - 1;
        }
    }

    _createEdges () {
        let nodeCount = (this._options.rows + 1) * (this._options.columns + 1);
        this._edges = new Array();

        for (let i = 0; i < nodeCount; i++) {
            if (i % this._options.rows + 1 <= this._options.rows) {
                this._edges.push(new Edge(
                    i, i + 1,
                    this._getEdgeXCoordinate(i, i + 1),
                    this._getEdgeYCoordinate(i, i + 1),
                ));
            }

            if (i + this._options.rows + 1 < nodeCount + 1) {
                this._edges.push(new Edge(
                    i, i + this._options.rows + 1,
                    this._getEdgeXCoordinate(i, i + this._options.rows + 1),
                    this._getEdgeYCoordinate(i, i + this._options.rows + 1),
                ));
            }
        }
    }

    _createBlocks () {
        let blockCount = this._options.rows * this._options.columns;
        this._blocks = new Array(blockCount);

        for (let i = 0; i < blockCount; i++) {
            this._blocks[i] = new Block(
                i,
                this._getBlockXCoordinate(i),
                this._getBlockYCoordinate(i)
            );
        }
    }

    _getNodeXCoordinate (i) { 
        return this._options.margin + 
               i % (this._options.columns + 1) * this._options.blockSize + 
               this._options.pathSize * (i % (this._options.columns + 1) + 0.5);
    }
    
    _getNodeYCoordinate (i) { 
        return this._options.margin + 
               Math.floor(i / (this._options.columns + 1)) * this._options.blockSize + 
               this._options.pathSize * (Math.floor(i / (this._options.columns + 1)) + 0.5);
    }

    _getNodeCoordinate (i) {
        return {
            x: this._getNodeXCoordinate(i), 
            y: this._getNodeYCoordinate(i)
        };
    }

    _getEdgeXCoordinate (i1, i2) {
        let coord1 = this._getNodeCoordinate(i1);
        let coord2 = this._getNodeCoordinate(i2);

        if (coord1.x == coord2.x) {
            return coord1.x;
        } else {
            return Math.max(coord1.x, coord2.x) - Math.floor((this._options.blockSize + this._options.pathSize) / 2);
        }
    }

    _getEdgeYCoordinate (i1, i2) {
        let coord1 = this._getNodeCoordinate(i1);
        let coord2 = this._getNodeCoordinate(i2);

        if (coord1.y == coord2.y) {
            return coord1.y;
        } else {
            return Math.max(coord1.y, coord2.y) - Math.floor((this._options.blockSize + this._options.pathSize) / 2);
        }
    }

    _getEdgeCoordinate (i1, i2) {
        return {
            x: this._getEdgeXCoordinate(i1, i2), 
            y: this._getEdgeYCoordinate(i1, i2)
        };
    }

    _getBlockXCoordinate (i) {
        return this._options.margin + 
               (i % (this._options.columns)) * (this._options.blockSize) +
               (i % (this._options.columns) + 1) * this._options.pathSize +
               this._options.blockSize / 2;
    }

    _getBlockYCoordinate (i) {
        return this._options.margin + 
                Math.floor(i / (this._options.columns)) * (this._options.blockSize) +
                Math.floor(i / (this._options.columns) + 1) * this._options.pathSize +
                this._options.blockSize / 2;
    }

    _getBlockCoordinate (i) {
        
    }

    findNode (i) {
        return this._nodes.find(e => { return e.i == i });
    }

    findEdge (i1, i2) {
        return this._edges.find(e => { return e.i1 == i1 && e.i2 == i2 });
    }

    findBlock (i) {
        return this._blocks.find(e => { return e.i == i });
    }

    get rows () {
        return this._options.rows;
    }

    get columns () {
        return this._options.columns;
    }

    get options () {
        return this._options;
    }

    get nodes () {
        return this._nodes;
    }

    get edges () {
        return this._edges;
    }

    get blocks () {
        return this._blocks;
    }
}
