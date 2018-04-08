class Element {

    constructor(coord) {
        this._coord = coord;
    }

}

// class Location {

//     constructor ()
// }


class StartPoint extends Element {

    constructor(coord, ) {
        super(coord);
        this._location = ELEMENT_LOCATION.PATH;
    }

}


class EndPoint extends Element {

    constructor(coord, direction)
    {
        super(coord);
        this._direction = direction;
        this._location = ELEMENT_LOCATION.PATH; 
    }
}

class Square extends Element {

    constructor(coord, color)
    {
        super(coord);
        this._color = color;
        this._location = ELEMENT_LOCATION.BLOCK;
    }
}

class Hexagon extends Element {

    constructor(coord, color)
    {
        super(coord);
        this._color = color;
        this._location = ELEMENT_LOCATION.BLOCK;
    }

}