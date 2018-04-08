;

class Puzzle {

    constructor(rows, columns, elements) {
        if (rows < 1)
            throw "Invalid value for puzzle rows";

        if (columns < 1)
            throw "Invalid value for puzzle columns";

        this._rows = rows;
        this._columns = columns;
        this._elements = elements;

        // this._nodes = new Array(rows * columns);
        // for (let i = 0; i < rows * columns; i++)
        // {
        //     this._nodes[i] = new Node()
        // }
    }

    get Rows() {
        return this._rows;
    }

    get Columns() {
        return this._columns;
    }
}