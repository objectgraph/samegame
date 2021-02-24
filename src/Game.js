export default class Game {

    constructor(rows, cols, colors) {
        this.data = [];
        this.undoStack = [];
        this.redoStack = [];
        this.rows = rows;
        this.cols = cols;
        this.score = 0;
        this.currentSelection = 0;
        this.gameOver = false;
        var id = 0
        for (var i = 0; i < rows; i++) {
            let row = [];
            for (var j = 0; j < cols; j++) {
                var obj = {
                    id: id,
                    row: i,
                    col: j,
                    deleted: false,
                    selected: false,
                    color: Math.ceil(Math.random() * colors)
                };
                id = id + 1;
                row.push(obj);
            }
            this.data.push(row);
        }
    }

    isValid = (row, col) => {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols
    }

    getSameColorNeighbors = (arr, value) => {
        const { row, col } = value;
        const data = this.data;
        //south
        if (this.isValid(row + 1, col) && !data[row + 1][col].deleted && data[row + 1][col].color === value.color && arr.indexOf(data[row + 1][col]) === -1) {
            arr.push(data[row + 1][col]);
            this.getSameColorNeighbors(arr, data[row + 1][col]);
        }
        //east
        if (this.isValid(row, col + 1) && !data[row][col + 1].deleted && data[row][col + 1].color === value.color && arr.indexOf(data[row][col + 1]) === -1) {
            arr.push(data[row][col + 1]);
            this.getSameColorNeighbors(arr, data[row][col + 1]);
        }

        //north
        if (this.isValid(row - 1, col) && !data[row - 1][col].deleted && data[row - 1][col].color === value.color && arr.indexOf(data[row - 1][col]) === -1) {
            arr.push(data[row - 1][col]);
            this.getSameColorNeighbors(arr, data[row - 1][col]);
        }

        //west
        if (this.isValid(row, col - 1) && !data[row][col - 1].deleted && data[row][col - 1].color === value.color && arr.indexOf(data[row][col - 1]) === -1) {
            arr.push(data[row][col - 1]);
            this.getSameColorNeighbors(arr, data[row][col - 1]);
        }

    }

    newGame = () => {
        this.undoStack = [];
        this.redoStack = [];
        this.gameOver = false;
        this.score = 0;
        this.currentSelection = 0;
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                let cell = this.data[i][j];
                cell.deleted = false;
                cell.selected = false;
                cell.color = Math.ceil(Math.random() * 5)
            }
        }
    }

    action = (cell) => {
        let arr = [];
        this.getSameColorNeighbors(arr, cell);
        if (arr.length > 0) {
            if (cell.selected) {
                this.undoStack.push(JSON.parse(JSON.stringify(this.data)));
                this.score = this.score + ((arr.length) * (arr.length - 1) * 10)
                arr.forEach((obj) => { obj.deleted = true });
                this.currentSelection = 0;
            }
            else {
                this.data.forEach((row) => {
                    row.forEach((item) => {
                        item.selected = false;
                    })
                });
                arr.forEach((obj) => { obj.selected = true });
                this.currentSelection = (arr.length) * (arr.length - 1) * 10
            }
            this.gravity();
            this.compact();
            this.gameOver = this.detectGameOver();
        }
    }

    liveCellCount = (data) => {
        var cellCount = 0;
        data.forEach((row) => {
            row.forEach((item) => {
                if (!item.deleted) {
                    cellCount++;
                }
            })
        })
        return cellCount;
    }

    undo = () => {
        if (this.undoStack.length > 0) {
            const nowLiveCount = this.liveCellCount(this.data);
            let redoStack = this.redoStack;
            this.redoStack.push(JSON.parse(JSON.stringify(this.data)));
            let undoStack = this.undoStack;
            let data = undoStack.pop();
            const afterUndoLiveCount = this.liveCellCount(data);
            const diff = afterUndoLiveCount - nowLiveCount;
            this.data = data;
            this.undoStack = undoStack
            this.redoStack = redoStack
            this.score = this.score - (diff * (diff - 1) * 10);
            this.gameOver = this.detectGameOver();
        }
    }

    redo = () => {
        if (this.redoStack.length > 0) {
            const nowLiveCount = this.liveCellCount(this.data);
            let undoStack = this.undoStack;
            this.undoStack.push(JSON.parse(JSON.stringify(this.data)));
            this.undoStack = undoStack;
            let redoStack = this.redoStack;
            let data = redoStack.pop();
            const afterUndoLiveCount = this.liveCellCount(data);
            const diff = nowLiveCount - afterUndoLiveCount;
            this.data = data;
            this.undoStack = undoStack
            this.redoStack = redoStack
            this.score = this.score + (diff * (diff - 1) * 10);
            this.gameOver = this.detectGameOver();
        }
    }

    gravity = () => {
        for (var j = this.cols - 1; j >= 0; j--) {
            for (var i = this.rows - 1; i >= 1; i--) {
                if (this.data[i][j].deleted) {
                    //find first non empty cell and exchange
                    let r = i - 1;
                    while (this.data[r][j].deleted && r > 0) {
                        r--;
                    }
                    if (!this.data[r][j].deleted) {
                        //exchange
                        this.swap(this.data, i, j, r, j);
                    }
                }
            }
        }

    }

    compact = () => {
        for (var j = this.cols - 1; j >= 1; j--) {
            if (this.colEmpty(this.data, j)) {
                //find lowest column that is non empty
                let col = j - 1;
                while (this.colEmpty(this.data, col) && col > 0) {
                    col--
                }
                for (var i = 0; i < this.rows; i++) {
                    this.swap(this.data, i, j, i, col);
                }
            }
        }
    }

    colEmpty = (data, col) => {
        for (let i = 0; i < data.length; i++) {
            if (!data[i][col].deleted) {
                return false;
            }
        }
        return true
    }

    detectGameOver = () => {
        const data = this.data;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (data[i][j].deleted) {
                    continue;
                }
                const color = data[i][j].color;
                if ((this.isValid(i - 1, j) && !data[i - 1][j].deleted && data[i - 1][j].color === color)
                    || (this.isValid(i, j + 1) && !data[i][j + 1].deleted && data[i][j + 1].color === color)
                    || (this.isValid(i + 1, j) && !data[i + 1][j].deleted && data[i + 1][j].color === color)
                    || (this.isValid(i, j - 1) && !data[i][j - 1].deleted && data[i][j - 1].color === color)) {
                    return false;
                }
            }
        }
        return true;
    }

    swap = (data, i, j, k, l) => {
        const trow = data[i][j].row;
        const tcol = data[i][j].col;

        data[i][j].row = data[k][l].row;
        data[i][j].col = data[k][l].col;
        data[k][l].row = trow;
        data[k][l].col = tcol;
        [data[i][j], data[k][l]] = [data[k][l], data[i][j]]
    }

}