import { Scene } from 'phaser';

export class Preloader extends Scene
{
  constructor ()
  {
    super('Preloader');
  }

  init ()
  {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, 'background');

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 200, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(this.game.config.width / 2 - 100, this.game.config.height / 2, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress) => {

      //  Update the progress bar (our bar is 196px wide, so 100% = 196px)
      bar.width = 200;

    });
  }

  preload ()
  {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath('assets');

    this.load.image('logo', 'logo.png');
    this.load.image('pikachu', 'pikachu.png');
  }

  create ()
  {
    // // const 
    // const savedState = JSON.parse(localStorage.getItem('gameSavedState')) || {
    //   "name": "",
    //   "gameEvents": []
    // }
    // if (savedState.name){
    //   this.game.registry.name = savedState.name
    //   this.game.registry.gameEvents = savedState.gameEvents
    // }
    // if (this.game.registry.name){
    //   this.scene.start('Game');
    // } else {
    //   this.scene.start('Game');
    // }
    this.scene.start('Game');
  }
}
