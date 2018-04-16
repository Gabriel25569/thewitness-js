// Que comece a festa!!
class Snake {

    constructor (start) {
        this._nodeStack = new Array();
        this._nodeStack.push(start);
        this._directions = new Array();
        this._direction = DIRECTION.NONE;
        this._movement = 0;
    }

    move (amount) {
        this._movement += amount;
    }

    pushNode (node) {
        this._nodeStack.push(node);
        this._directions.push(this._direction);
    }

    popNode () {
        let node = this._nodeStack.pop();
        let direction = this._directions.pop();
        return {node: node, direction: direction};
    }

    resetMovement () {
        this._movement = 0;
    }

    get nodeStack () {
        return this._nodeStack;
    }

    get lastNode () {
        return this._nodeStack[this._nodeStack.length - 1];
    }

    get lastDirection () {
        return this._directions[this._directions.length - 1];
    }

    get movement () {
        return this._movement;
    }
    
    set movement (amount) {
        this._movement = amount;
    }
    
    get direction () {
        return this._direction;
    }

    set direction (direction) {
        this._direction = direction;
    }
}
