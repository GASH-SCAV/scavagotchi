import { Scene } from 'phaser';

export class MainMenu extends Scene
{
  constructor ()
  {
    super('MainMenu');
  }

  create ()
  {
    const { width, height } = this.game.config;
    this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

    this.add.image(width / 2, height / 2 - 84, 'logo');
    
    this.add.image(0, 0, 'pikachu')

    this.add.text(512, 460, 'Main Menu', {
      fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => {

      this.scene.start('Game');

    });
  }
}
