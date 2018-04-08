// I open my eyes
// I try to see but I'm blinded
// By the white light
// I can't remember how
// I can't remember why
// I'm lying here tonight
// And I can't stand the pain
// And I can't make it go away
// No I can't stand the pain

// How could this happen to me?
// I've made my mistakes
// Got no where to run
// The night goes on
// As I'm fading away
// I'm sick of this life
// I just wanna scream
// How could this happen to me?

// Everybody's screaming
// I try to make a sound
// But no one hears me
// I'm slipping of the edge
// I'm hanging by a thread
// I wanna start this over again
// So I try to hold on to
// A time when nothing mattered
// And I can't explain what happened
// And I can't erase the things that I've done
// No I can't

// How could this happen to me?
// I've made my mistakes
// Got no where to run
// The night goes on
// As I'm fading away
// I'm sick of this life
// I just wanna scream
// How could this happen to me?

// I've made my mistakes
// Got no where to run
// The night goes on
// As I'm fading away
// I'm sick of this life
// I just wanna scream
// How could this happen to me?

class Movement {

    constructor (direction)
    {
        this._direction = direction;
        this._amount = 0;
    }

    increaseAmount(value) {
        this._amount += value;   // validation could be checked here such as only allowing non numerical values
    }

    decreaseAmount(value) {
        this._amount -= value;
    }
}


// Que comece a festa!!
class Snake {

    constructor(start)
    {
        this._start = start;
        this._stack = new Array();

    }

    forward(amount)
    {

    }

    backwards(amount)
    {

    }
}