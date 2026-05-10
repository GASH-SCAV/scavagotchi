import { Scene, Math as PhaserMath } from 'phaser';

export class Game extends Scene
{
  constructor ()
  {
    super('Game');
  }

  preload ()
  {
    this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml');
    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(i => {
      this.load.image(`neutral${i}`, `assets/sprites/neutral_${i}.png`);
    });
    this.load.image('sanity1', 'assets/objects/fourloko.png')
    this.load.image('sanity2', 'assets/objects/monster.png')
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
  renderNickyName () {
    this.add.bitmapText(100, 20, 'arcade', this.registry.name).setTint(0xff00ff);
  }

  // https://phasergames.com/how-to-make-a-health-bar-in-phaser-3/
  makeBar(labelText, y, color) {
    this.add.bitmapText(12, y, 'arcade', labelText.toUpperCase()).setTint(0xff00ff).setFontSize(16);
    const parentBar = this.add.graphics();
    parentBar.fillStyle(0x0000FF, 1);
    parentBar.fillRect(0, 0, this.game.config.width, 30);
    parentBar.y = y + 15;
    const bar = this.add.graphics();
    bar.x = 5
    bar.fillStyle(color, 1);
    bar.fillRect(0, 0, this.game.config.width - 10, 20);
    bar.y = y + 20;
    return bar;
  }

  setValue(statLabel, percentage) {
    if (percentage > 100){
      percentage = 100
    }
    if (percentage < 1){
      percentage = 0
    }
    this.stats[statLabel].value = percentage
    const bar = this.stats[statLabel].bar
    if (percentage > 60){
      bar.fillStyle(0x00FF00, 1)
    } else if (percentage > 30){
      bar.fillStyle(0xFFFF00, 1)
    }
     else {
      bar.fillStyle(0xFF0000, 1)
    }
    bar.fillRect(0, 0, this.game.config.width - 10, 20)
    bar.scaleX = percentage/100;
  }

  statBar () {
    this.stats = {};
    const labels = ["hunger", "chaos", "dignity", "sanity"];
    labels.forEach((label, i) => {
      this.stats[label] = {
        bar: this.makeBar(label, 600 + i * 50, 0x00FF00),
        value: 100 // hard code to 100 for now
      } 
    })
  }

  spawnSanityItem = () => {
    this.sanityItems ||= []
    const { width, height } = this.game.config;
    if (this.sanityItems.length > 3){
      return
    }
    const image = PhaserMath.RND.pick(["sanity1", "sanity2"]) 
    let x = PhaserMath.Between(50, width - 50);
    let y = PhaserMath.Between(50, 550)
    // don't let it spawn on my face or other items
    while (this.avatar.getBounds().contains(x, y) || this.sanityItems.find(item => item.getBounds().contains(x, y))){
      x = PhaserMath.Between(50, width - 50);
      y = PhaserMath.Between(50, 550)
    }    
    let newItem = this.physics.add.image(x, y, image);
    newItem.displayHeight = 50;
    newItem.scaleX = newItem.scaleY;
    this.sanityItems.push(newItem)
  }

  handleTimers = () => {
    const itemTimer = this.time.addEvent({ 
      delay: 1000, 
      callback: () => {
        this.spawnSanityItem();
        itemTimer.reset
        itemTimer.delay = Math.floor(Math.random() * 9000) + 3000
        this.time.addEvent(itemTimer);
    }});

    const statTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        ["sanity"].forEach((label) => {
          this.setValue(label, this.stats[label].value - 1);
          statTimer.reset;
          this.time.addEvent(statTimer);
        })
      }
    })
  }

  setHandlers () {
    this.input.on('pointerdown', (e) => {
      this.rotateFace(e);
    });
    this.input.on('pointermove', (e) => {
      this.rotateFace(e);
      if (e.isDown) {
        this.moveFace(e);
      }
    })
    this.input.on('pointerup', (e) => {
      this.avatar.setTexture('neutral0');
      this.avatar.body.setVelocity(0, 0);
    });
  }

  initialRender ()
  {
    this.renderNickyName();
    this.statBar();
    this.cameras.main.setBackgroundColor(0x000000);
    const { width, height } = this.game.config;
    this.avatar = this.physics.add.image(width / 2, height / 2, 'neutral0').setDisplaySize(100, 100);
  }

  create ()
  {
    this.setHandlers();
    this.initialRender();
    this.handleTimers();
  }
  
  update() {
    https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser/Collision_detection
    this.physics.collide(this.avatar, this.sanityItems, (avatar, sanityItem) => {
      sanityItem.destroy()
      this.setValue("sanity", this.stats["sanity"].value + 10)
    });
  }

  degreeToDirection = (degrees) => {
    // Eight segments 
    if (degrees >= -112.5 && degrees < -67.5) {
      return '1'; // up
    } else if (degrees >= -67.5 && degrees < -22.5) {
      return '2'; // up right
    } else if (degrees >= -22.5 && degrees < 22.5) {
      return '3'; // right
    } else if (degrees >= 22.5 && degrees < 67.5) {
      return '4'; // down right
    } else if (degrees >= 67.5 && degrees < 112.5) {
      return '5'; // down
    } else if (degrees >= 112.5 && degrees < 157.5) {
      return '6'; // down left
    } else if (degrees >= 157.5 || degrees < -157.5) {
      return '7'; // left
    } else if (degrees >= -157.5 && degrees < -112.5) {
      return '8'; // up left
    }
  }

  rotateFace = (e) => {
    const degrees = (PhaserMath.Angle.BetweenPoints(this.avatar, e) * (180 / Math.PI));
    this.avatar.setTexture(`neutral${this.degreeToDirection(degrees)}`);
  }

  moveFace = (pointer) => {
    // https://github.com/phaserjs/examples/blob/master/public/src/physics/arcade/move%20to%20pointer.js
    this.physics.moveToObject(this.avatar, pointer, 100);
  }
}
