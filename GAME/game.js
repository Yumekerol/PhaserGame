window.onload = function(){

    var config = {
        width: 800,
        height: 600,
        backgroundColor: 0x000000,
        scene: [Scene1, Scene2],
        physics: {
          default: 'arcade',
          arcade: {
            debug: false
          }
        }
    }

    var game = new Phaser.Game(config);

}
