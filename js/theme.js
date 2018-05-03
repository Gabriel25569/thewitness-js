class Theme {
    
    constructor (background, path, snake) {
        this._re = /^#[1234567890ABCDEF]{6}$/;
        this.background = background;
        this.path = path;
        this.snake = snake;
    }

    get background ()
    {
        return this._background;
    }

    set background (value)
    {
        if (this._re.test(value))
            this._background = value;
        else
            throw "Invalid background color for theme."
    }

    get path ()
    {
        return this._path;
    }

    set path (value)
    {
        if (this._re.test(value))
            this._path = value;
        else
            throw "Invalid path color for theme."
    }

    get snake ()
    {
        return this._snake;
    }

    set snake (value)
    {
        if (this._re.exec(value))
            this._snake = value;
        else
            throw "Invalid snake color for theme."
    }
}