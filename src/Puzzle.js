class Node {
    constructor (name)
    {
        this._name = name;
        this._neighbors = new Array(4);
    }

    getName ()
    {
        return this._name;
    }

    addNeighbor (name, direction)
    {
        this._neighbors[direction] = name;
    }
}

class Puzzle {

    constructor (rows, columns, elements, options) {
        if (rows < 1)
            throw "Invalid value for puzzle rows";

        if (columns < 1)
            throw "Invalid value for puzzle columns";

        this._rows = rows;
        this._columns = columns;
        this._options = options;

        this._nodes = new Array(rows * columns);

        this._edges = new Array(rows * columns);
        for (let i = 0; i < rows * columns; i++)
            this._edges[i] = new Array(rows * columns);

        this._blocks = new Array(rows);
        for (let i = 0; i < rows; i++)
            this._blocks[i] = new Array(columns);

        
        for (let i = 0; i < elements.length; i++)
        {
            this.addElement(elements[i]);
        }

        // this._nodes = new Array(rows * columns);
        // for (let i = 0; i < rows * columns; i++)
        // {
        //     this._nodes[i] = new Node()
        // }
    }

    addElement (element)
    {
        let location = element.location;
        switch (element.locationType)
        {
            case LOCATION_TYPE.NODE:
                this._nodes[location.x] = element;
                break;
            case LOCATION_TYPE.EDGE:
                this._edges[location.x][location.y] = element;
            case LOCATION_TYPE.BLOCK:
                this._blocks[location.x][location.y] = element;
                break;
            default:
                throw "Puzzle with invalid element type";
        }
    }

    get rows () {
        return this._rows;
    }

    get columns () {
        return this._columns;
    }

    get options () {
        return this._options;
    }
    
    get blocks ()
    {
        return this._blocks
    }

}