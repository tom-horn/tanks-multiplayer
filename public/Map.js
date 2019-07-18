function Map(seed) {
    this.seed = seed;
    this.probabilityLimit = 0.3;
    this.myrng = new Math.seedrandom(this.seed);
    this.cellSize = 40;
    this.cells = [];

    this.createWalls = function() {
        for (let i = 0; i < Math.round(width / this.cellSize); i ++) {
            for (let j = 0; j < Math.round(height / this.cellSize); j++) {
                let left;
                let right;
                let top;
                let bottom;

                // if its at the very left or very right columns, set the border
                if (i === 0) {
                    left = true;
                } else if (i === Math.round(width / this.cellSize) - 1) {
                    right = true;
                }

                // if its at the very top or bottom rows, set the border
                if (j === 0) {
                    top = true;
                } else if (j === Math.round(height / this.cellSize) - 1) {
                    bottom = true;
                }
                
                // check if we're setting the bottom border
                if (!bottom) {
                    if (this.myrng() < this.probabilityLimit) {
                        bottom = true;
                    }
                }
                
                // check if we're setting the right border
                if (!right) {
                    if (this.myrng() < this.probabilityLimit) {
                        right = true;
                    }
                }

                this.cells.push(new Cell(j, i, left, right, top, bottom, this.cellSize));
            }
        }
    }

    this.getSurroundingCells = function(x, y) {
        let row = Math.floor(y / this.cellSize);
        let col = Math.floor(x / this.cellSize);
        
        let nearbyCells = this.cells.filter(cell => cell.row <= row + 1 && cell.row >= row - 1
            && cell.col <= col + 1 && cell.col >= col - 1);
        
        return nearbyCells;
    }
}