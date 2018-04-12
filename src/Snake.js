// Que comece a festa!!
class Snake {

    constructor (start) {
        this._nodeStack = new Array();
        this._nodeStack.push(start);
        this._direction = DIRECTION.NONE;
        this._movement = 0;
    }

    move (amount) {
        this._movement += amount;
    }

    pushNode () {

    }

    get nodeStack () {
        return this._nodeStack;
    }

    get lastNode () {
        return this._nodeStack[this._nodeStack.length - 1];
    }

    get movement () {
        return this._movement;
    }

    get direction () {
        return this._direction;
    }

    set direction (direction) {
        this._direction = direction;
    }
}
