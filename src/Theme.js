// BACKGROUND: #F9B700
// LINES: #3B280A


class Theme {
    
    constructor (background, path, snake) {
        this._re = /^#[1234567890ABCDEF]{6}$/;
        this.Background = background;
        this.Path = path;
        this.Snake = snake;
    }

    get Background ()
    {
        return this._background;
    }

    set Background (value)
    {
        if (this._re.test(value))
            this._background = value;
        else
            throw "Invalid background color for theme."
    }

    get Path ()
    {
        return this._path;
    }

    set Path (value)
    {
        if (this._re.test(value))
            this._path = value;
        else
            throw "Invalid path color for theme."
    }

    get Snake ()
    {
        return this._snake;
    }

    set Snake (value)
    {
        if (this._re.exec(value))
            this._snake = value;
        else
            throw "Invalid snake color for theme."
    }
}