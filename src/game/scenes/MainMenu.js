// Ruthlessly stolen from https://github.com/phaserjs/examples/blob/master/public/src/input/keyboard/enter%20name.js

import { Scene, Math } from 'phaser';

export class MainMenu extends Scene
{
  constructor ()
  {
    super('MainMenu');
  }

  updateGame = (obj) => {
    const oldState = {name: this.game.registry.name, gameEvents: this.game.registry.gameEvents}
    const newState = {...oldState, ...obj}
    if (newState.name) {
      this.game.registry.name = newState.name
    }
    if (newState.gameEvents) {
      this.game.registry.gameEvents = newState.gameEvents
    }
    localStorage.setItem('gameSavedState', JSON.stringify(newState))
  }

  preload ()
  {
      // this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
      this.load.image('block', 'assets/input/block.png');
      this.load.image('rub', 'assets/input/rub.png');
      this.load.image('end', 'assets/input/end.png');
      this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml');
  }


  create ()
  {
    const chars = [
            [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
            [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
            [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>' ]
        ];
        const cursor = { x: 0, y: 0 };
        let name = '';
        const {width, height} = this.game.config;
        this.add.bitmapText(100, height / 3 - 50, 'arcade', "NAME YOUR NICKY").setTint(0xff00ff);
        const input = this.add.bitmapText(100, height / 3, 'arcade', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-').setLetterSpacing(20)
        input.setInteractive();

        const rub = this.add.image(input.x + 430, input.y + 148, 'rub');
        const end = this.add.image(input.x + 482, input.y + 148, 'end');

        const block = this.add.image(input.x - 10, input.y - 2, 'block').setOrigin(0);

        // const legend = this.add.bitmapText(80, 260, 'arcade', 'RANK  SCORE   NAME').setTint(0xff00ff);https://github.com/phaserjs/examples/blob/master/public/assets/input/block.png

        // this.add.bitmapText(80, 310, 'arcade', '1ST   50000    ').setTint(0xff0000);
        // this.add.bitmapText(80, 360, 'arcade', '2ND   40000    ICE').setTint(0xff8200);
        // this.add.bitmapText(80, 410, 'arcade', '3RD   30000    GOS').setTint(0xffff00);
        // this.add.bitmapText(80, 460, 'arcade', '4TH   20000    HRE').setTint(0x00ff00);
        // this.add.bitmapText(80, 510, 'arcade', '5TH   10000    ETE').setTint(0x00bfff);

        const playerText = this.add.bitmapText(width / 2, height / 2 + 30, 'arcade', name).setTint(0xff00ff).setOrigin(0.5);

        this.input.keyboard.on('keyup', event =>
        {

            if (event.keyCode === 37)
            {
                //  left
                if (cursor.x > 0)
                {
                    cursor.x--;
                    block.x -= 52;
                }
            }
            else if (event.keyCode === 39)
            {
                //  right
                if (cursor.x < 9)
                {
                    cursor.x++;
                    block.x += 52;
                }
            }
            else if (event.keyCode === 38)
            {
                //  up
                if (cursor.y > 0)
                {
                    cursor.y--;
                    block.y -= 64;
                }
            }
            else if (event.keyCode === 40)
            {
                //  down
                if (cursor.y < 2)
                {
                    cursor.y++;
                    block.y += 64;
                }
            }
            else if (event.keyCode === 13 || event.keyCode === 32)
            {
                //  Enter or Space
                if (cursor.x === 9 && cursor.y === 2 && name.length > 0)
                {
                    //  Submit
                }
                else if (cursor.x === 8 && cursor.y === 2 && name.length > 0)
                {
                    //  Rub
                    name = name.substr(0, name.length - 1);

                    playerText.text = name;
                }
                else if (name.length < 8)
                {
                    //  Add
                    name = name.concat(chars[cursor.y][cursor.x]);

                    playerText.text = name;
                }
            }

        });

        input.on('pointermove', (pointer, x, y) =>
        {

            const cx = Math.Snap.Floor(x, 52, 0, true);
            const cy = Math.Snap.Floor(y, 64, 0, true);
            const char = chars[cy][cx];

            cursor.x = cx;
            cursor.y = cy;

            block.x = input.x - 10 + (cx * 52);
            block.y = input.y - 2 + (cy * 64);

        }, this);

        input.on('pointerup', (pointer, x, y) =>
        {

            const cx = Math.Snap.Floor(x, 52, 0, true);
            const cy = Math.Snap.Floor(y, 64, 0, true);
            const char = chars[cy][cx];

            cursor.x = cx;
            cursor.y = cy;

            block.x = input.x - 10 + (cx * 52);
            block.y = input.y - 2 + (cy * 64);

            if (char === '<' && name.length > 0)
            {
                //  Rub
                name = name.substr(0, name.length - 1);

                playerText.text = name;
            }
            else if (char === '>' && name.length > 0)
            {
                //  Submit
                this.updateGame({name})
                this.scene.start('Game');
            }
            else if (name.length < 8)
            {
                //  Add
                name = name.concat(char);

                playerText.text = name;
            }

        }, this);

    }

  }

