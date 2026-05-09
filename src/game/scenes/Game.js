import { Scene } from 'phaser';

export class Game extends Scene
{
  constructor ()
  {
    super('Game');
  }

  bottomBar () {
    
  }

  create ()
  {
    this.cameras.main.setBackgroundColor(0x000000);

    const { width, height } = this.game.config;

    this.add.image(width / 2, height / 2, 'pikachu').setDisplaySize(200, 200);


    this.input.once('pointerdown', () => {

      this.scene.start('GameOver');

    });
  }
}
