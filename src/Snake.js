class Movement {

    constructor (direction)
    {
        this._direction = direction;
        this._amount = 0;
    }

    increaseAmount(value) {
        this._amount += value;  
    }

    decreaseAmount(value) {
        this._amount -= value;
    }
}


// Que comece a festa!!
class Snake {

    constructor (start)
    {
        this._nodeStack = new Array();
        this._nodeStack.push(start);
        //this._current
    }

    forward (amount)
    {

    }

    backwards (amount)
    {

    }

    pushNode ()
    {

    }

    get nodeStack () {
        return this._nodeStack;
    }
}
