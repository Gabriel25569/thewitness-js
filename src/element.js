class Element {

    constructor(type, locationType, location) {
        this._type = type;
        this._locationType = locationType;
        this._location = location;
    }

    get type ()
    {
        return this._type;
    }

    get locationType ()
    {
        return this._locationType;
    }

    get location ()
    {
        return this._location;
    }

}

// class Location {

//     constructor ()
// }


// class StartPoint extends Element {

//     constructor(coord, ) {
//         super(coord);
//         this._location = ELEMENT_LOCATION.PATH;
//     }

// }


// class EndPoint extends Element {

//     constructor(coord, direction)
//     {
//         super(coord);
//         this._direction = direction;
//         this._location = ELEMENT_LOCATION.PATH; 
//     }
// }

// class Square extends Element {

//     constructor(coord, color)
//     {
//         super(coord);
//         this._color = color;
//         this._location = ELEMENT_LOCATION.BLOCK;
//     }
// }

// class Hexagon extends Element {

//     constructor(coord, color)
//     {
//         super(coord);
//         this._color = color;
//         this._location = ELEMENT_LOCATION.BLOCK;
//     }

// }