function main() {
    var con_width = 80;
    var con_height = 24;

    var px = 1;
    var py = 1;

    var display = new ROT.Display({
        width: con_width,
        height: con_height,
        fontSize: 18
    });
    var walls = Array(con_width);
    for(var x = 0; x < walls.length; x++) walls[x] = Array(con_height).fill(1);

    // TODO: Objects in the map, not magic numbers
    // Build the map
    var map = new ROT.Map.Digger();
    map.create();

    // Draw the tunnels first (ends on a wall, wipes out doors)
    map.getCorridors().forEach(function(cor) {
        cor.create(function(x, y, wall) {
            walls[x][y] = wall;
        });
    });

    // Draw all the rooms
    map.getRooms().forEach(function(room) {
        room.create(function(x, y, value) {
            walls[x][y] = value;
        });

        px = room.getCenter()[0];
        py = room.getCenter()[1];
    });

    // TODO: Navigate entire map, not just subset of map
    // TODO: Break this up into keypress / redraw
    var redraw = function(e) {
        if(e != null) {
            var ch = e.key;

            new_px = px;
            new_py = py;

            switch(ch) {
                case 'ArrowUp':
                case '8': new_py -= 1; break;

                case 'ArrowDown':
                case '2': new_py += 1; break;

                case 'ArrowLeft':
                case '4': new_px -= 1; break;

                case 'ArrowRight':
                case '6': new_px += 1; break;

                // Diagonal movement
                case '9': new_py -= 1; new_px += 1; break;
                case '3': new_py += 1; new_px += 1; break;
                case '1': new_py += 1; new_px -= 1; break;
                case '7': new_py -= 1; new_px -= 1; break;

            }

            // Out of bounds checking
            if(new_px < 0) new_px = 0;
            else if(new_px >= con_width) new_px = con_width - 1;
            if(new_py < 0) new_py = 0;
            else if(new_py >= con_height) new_py = con_height - 1;

            // Door collision
            if(walls[new_px][new_py] == 2) {
                walls[new_px][new_py] = 3;
            } else if(walls[new_px][new_py] != 1) {
                // Not wall collision
                px = new_px;
                py = new_py;
            } 
        }

        // TODO: Don't redraw the whole map
        // Draw the map again
        for(var x = 0; x < walls.length; x++) {
            for(var y = 0; y < walls[x].length; y++) {
                switch(walls[x][y]) {
                    case 0: display.draw(x, y, '.', '#555'); break;
                    case 1: display.draw(x, y, '#'); break;
                    case 2: display.draw(x, y, '+', '#aa0'); break;
                    case 3: display.draw(x, y, '/', '#aa0'); break;
                }
            }
        }

        // And the player
        display.draw(px, py, '@', '#0a0');
    };

    document.body.appendChild(display.getContainer());
    document.onkeydown = redraw;

    redraw(null);
};

window.onload = main;
