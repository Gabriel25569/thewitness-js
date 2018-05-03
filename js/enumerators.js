const DIRECTION = {
    NONE: -1,
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3
}

// const LOCATION_TYPE = {
//     NODE: 0,
//     EDGE: 1,
//     BLOCK: 2
// }

const NODE_ELEMENT_TYPE = {
    START: 0,
    END: 1,
    HEXAGON: 10,
}

const EDGE_ELEMENT_TYPE = {
    HEXAGON: 10,
    EDGE_BREAK: 11,
}

const BLOCK_ELEMENT_TYPE = {
    SQUARE: 21,
    STAR: 22,
    CANCELATOR: 23
}

// const COLOR = {
//     BLACK: 0,
//     WHITE: 1,
//     RED: 2,
//     BLUE: 3,
//     GREEN: 4,
//     YELLOW: 5,
//     PURPLE: 6,
//     ORANGE: 7
// }

const START_RADIUS = 5 / 4;
const END_SIZE = 1 / 3;