class Snake {

    constructor (start) {
        this._stack = new Array();
        this._stack.push(start);

        this._directions = new Array();
        this._direction = DIRECTION.NONE;

        this._movement = 0;
    }

    move (amount) {
        this._movement += amount;
    }

    push (index) {
        this._stack.push(index);
        this._directions.push(this._direction);
    }

    pop () {
        let nodeIndex = this._stack.pop();
        let direction = this._directions.pop();
        return {index: nodeIndex, direction: direction};
    }

    get stack () {
        return this._stack;
    }

    get lastNode () {
        return this._stack[this._stack.length - 1];
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
