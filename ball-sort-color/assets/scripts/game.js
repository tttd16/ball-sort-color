// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    holderPrefabs: {
      default: null,
      type: cc.Prefab,
    },
    ballPrefabs: {
      default: null,
      type: cc.Prefab,
    },
    currentLevelLabel: {
      default: null,
      type: cc.Label,
    },
    levelPrefab: {
      default: null,
      type: cc.Prefab,
    },
    levelLockPrefab: {
      default: null,
      type: cc.Prefab,
    },
    holdersInCurrentLevel: [],
    levels: [],
    currentLevel: 1,
    nodesManagement: [],
    currentGameMode: null,
    currentLevelEasy: 1,
    currentLevelNormal: 1,
    currentLevelHard: 1,
    popAudio: {
      default: null,
      type: cc.AudioClip,
    },
    pushAudio: {
      default: null,
      type: cc.AudioClip,
    },
    correctAudio: {
      default: null,
      type: cc.AudioClip,
    },
    sprayAudio: {
      default: null,
      type: cc.AudioClip,
    },
    themeAudio: {
      default: null,
      type: cc.AudioClip,
    },
    clickAudio: {
      default: null,
      type: cc.AudioClip,
    },
    successAudio: {
      default: null,
      type: cc.AudioClip,
    },
    isOn: true,
    isBallMoving: false,
    levelEasyPassed: 1,
    levelNormalPassed: 1,
    levelHardPassed: 1,
    currentHolders: [],
    dummyLevels: null,
    isMoving: null,
    paperParticle: {
      default: null,
      type: cc.ParticleSystem
    },
    paperParticleHolder: {
      default: null,
      type: cc.ParticleSystem
    },
    nodeContentEasy: {
      default: null,
      type: cc.Node
    },
    nodeContentNormal: {
      default: null,
      type: cc.Node,
    },
    nodeContentHard: {
      default: null,
      type: cc.Node
    }
  },

  onLoad() {
    if (this.isOn) {
      cc.audioEngine.playEffect(this.themeAudio, false);
    } else {
      cc.audioEngine.stopAllEffects();
    }
    this.isMoving = true;
  },

  start() {
    let levelPassed = JSON.parse(cc.sys.localStorage.getItem("levelPassed"));
    if (levelPassed) {
      this.levelEasyPassed = levelPassed.easy || 1;
      this.levelNormalPassed = levelPassed.normal || 1;
      this.levelHardPassed = levelPassed.hard || 1;
    }
    this.paperParticle.stopSystem();
    this.paperParticleHolder.stopSystem();
  },

  onRatePopup() {
    cc.audioEngine.playEffect(this.clickAudio, false);
    let review = cc.find("popup_review", this.node);
    review.active = true;
    let startBg = cc.find("start_bg", this.node);
    startBg.opacity = 100;
  },

  offRatePopup() {
    cc.audioEngine.playEffect(this.clickAudio, false);
    let review = cc.find("popup_review", this.node);
    review.active = false;
    let startBg = cc.find("start_bg", this.node);
    startBg.opacity = 255;
  },

  onAboutUs() {
    cc.audioEngine.playEffect(this.clickAudio, false);
    let aboutUs = cc.find("popup_about_us", this.node);
    aboutUs.active = true;
    let startBg = cc.find("start_bg", this.node);
    startBg.opacity = 100;
  },

  offAboutUs() {
    cc.audioEngine.playEffect(this.clickAudio, false);
    let aboutUs = cc.find("popup_about_us", this.node);
    aboutUs.active = false;
    let startBg = cc.find("start_bg", this.node);
    startBg.opacity = 255;
  },

  moveScreenToAnotherScreen(nameScreen, nameAnotherScreen) {
    cc.audioEngine.playEffect(this.clickAudio, false);
    let screen = cc.find(nameScreen, this.node);
    screen.active = false;
    let anotherScreen = cc.find(nameAnotherScreen, this.node);
    anotherScreen.active = true;
  },

  onPlay() {
    this.moveScreenToAnotherScreen("start_bg", "game_mode");
  },

  exitGame() {
    cc.audioEngine.playEffect(this.clickAudio, false);
    let gamePlayNode = cc.find("game_play", this.node);
    let menuNode = cc.find("menu_btn", gamePlayNode);
    menuNode.opacity = 255;
    let popup = cc.find("popup_exit", this.node);
    popup.active = false;
    if (this.isOn) {
      cc.audioEngine.playEffect(this.themeAudio, false);
    } else {
      cc.audioEngine.stopAllEffects();
    }
    this.moveScreenToAnotherScreen("game_play", "game_mode");
  },

  cancelPopup() {
    cc.audioEngine.playEffect(this.clickAudio, false);
    let popup = cc.find("popup_exit", this.node);
    let gamePlayNode = cc.find("game_play", this.node);
    let menuNode = cc.find("menu_btn", gamePlayNode);
    menuNode.opacity = 255;
    popup.active = false;
  },

  backHomeFromGameMode() {
    this.moveScreenToAnotherScreen("game_mode", "start_bg");
  },

  backGameModeFromGamePlay() {
    this.nodeContentEasy._children = [];
    this.nodeContentNormal._children = [];
    this.nodeContentHard._children = [];
    cc.audioEngine.playEffect(this.clickAudio, false);
    this.currentHolders = [];
    let gamePlayNode = cc.find("game_play", this.node);
    let menuNode = cc.find("menu_btn", gamePlayNode);
    menuNode.opacity = 100;
    let popup = cc.find("popup_exit", this.node);
    popup.active = true;
  },

  backGameModeFromEasyMode() {
    this.moveScreenToAnotherScreen("easy_mode", "game_mode");
  },

  backGameModeFromNormalMode() {
    this.moveScreenToAnotherScreen("normal_mode", "game_mode");
  },

  backGameModeFromHardMode() {
    this.moveScreenToAnotherScreen("hard_mode", "game_mode");
  },

  gainLevel(level) {
    this.currentLevelLabel.string = `Level \n ${level}`;
  },

  onMusic() {
    cc.audioEngine.playEffect(this.clickAudio, false);
    this.isOn = !this.isOn;
    let bgNode = cc.find("start_bg", this.node);
    let soundOnNode = cc.find("sound_on_icon", bgNode);
    let soundOffNode = cc.find("sound_off_icon", bgNode);
    if (!this.isOn) {
      soundOnNode.active = false;
      soundOffNode.active = true;
    } else {
      soundOnNode.active = true;
      soundOffNode.active = false;
    }
    if (this.isOn) {
      cc.audioEngine.playEffect(this.themeAudio, false);
    } else {
      cc.audioEngine.stopAllEffects();
    }
  },

  onGameMode(pathResources, nodeName) {
    this.getDataFromJson(pathResources)
      .then(() => {
        this.moveScreenToAnotherScreen("game_mode", nodeName);
        if (nodeName === "easy_mode") {
          this.currentGameMode = "easy";
          this.loadLevelMode(this.nodeContentEasy, nodeName, this.levelEasyPassed);
        } else if (nodeName === "normal_mode") {
          this.currentGameMode = "normal";
          this.loadLevelMode(this.nodeContentNormal, nodeName, this.levelNormalPassed);
        } else {
          this.currentGameMode = "hard";
          this.loadLevelMode(this.nodeContentHard, nodeName, this.levelHardPassed);
        }
      })
      .catch((err) => console.log(err));
  },

  onEasyMode() {
    this.onGameMode("levels-easy", "easy_mode");
  },

  onMediumMode() {
    this.onGameMode("levels-normal", "normal_mode");
  },

  onHardMode() {
    this.onGameMode("levels-hard", "hard_mode");
  },

  loadLevelMode(node, nodeName, levels) {
    for (let i = 0; i < this.levels.length; i++) {
      let level;
      if (i < levels) {
        level = cc.instantiate(this.levelPrefab);
        level.on(cc.Node.EventType.TOUCH_END, () => {
          let levelTarget = +level._children[0].getComponent(cc.Label).string;
          if (this.currentGameMode === "easy") {
            this.currentLevelEasy = levelTarget;
          } else if (this.currentGameMode === "normal") {
            this.currentLevelNormal = levelTarget;
          } else {
            this.currentLevelHard = levelTarget;
          }
          this.moveScreenToAnotherScreen(nodeName, "game_play");
          this.clearBalls();
          this.loadGame(levelTarget, this.levels);
        });
        level._children[0].getComponent(cc.Label).string = `${i + 1}`;
      } else {
        level = cc.instantiate(this.levelLockPrefab);
      }
      level._children[0].getComponent(cc.Label).string = `${i + 1}`;
      node.addChild(level);
    }
  },

  spawnHoloLevel(x, y) {
    let level = cc.instantiate(this.levelPrefab);
    level.setPosition(x, y);
    return level;
  },

  spawnHoloLevelLock(x, y) {
    let level = cc.instantiate(this.levelLockPrefab);
    level.setPosition(x, y);
    return level;
  },

  victory() {
    let complete = cc.find("popup_complete", this.node);
    complete.active = true;
    let gamePlay = cc.find("game_play", this.node);
    gamePlay.opacity = 0;
    let messageComplete = [
      "Execellent!",
      "Superb!",
      "Good!",
      "Fantastic!",
      "Wondrous!",
    ];
    let random = Math.floor(Math.random() * (messageComplete.length - 1));
    complete._children[1].getComponent(cc.Label).string =
      messageComplete[random];
  },

  onTapToNextLevel() {
    let complete = cc.find("popup_complete", this.node);
    complete.active = false;
    let gamePlay = cc.find("game_play", this.node);
    gamePlay.opacity = 255;
    this.next();
  },

  addHolder() {
    let dummyCurrentLevelEasy = this.currentLevelEasy;
    let dummyCurrentLevelNormal = this.currentLevelNormal;
    let dummyCurrentLevelHard = this.currentLevelHard;
    if (this.currentHolders.length > 0) {
      if (this.currentGameMode === 'easy') {
        if (this.dummyLevels[dummyCurrentLevelEasy - 1].map.length === 12) {
          cc.audioEngine.playEffect(this.sprayAudio, false);
        } else {
          let newHolder = {
            values: [],
          };
          for (let i = 0; i < this.dummyLevels[dummyCurrentLevelEasy - 1].map.length; i++) {
            this.dummyLevels[dummyCurrentLevelEasy - 1].map[i].values = this.currentHolders[i];
          }
          this.dummyLevels[dummyCurrentLevelEasy - 1].map.push(newHolder);
          this.currentHolders.push([]);
          this.clearBalls();
          this.loadGame(dummyCurrentLevelEasy, this.dummyLevels);
        }
      } else if (this.currentGameMode === 'normal') {
        if (this.dummyLevels[dummyCurrentLevelNormal - 1].map.length === 12) {
          cc.audioEngine.playEffect(this.sprayAudio, false);
        } else {
          let newHolder = {
            values: [],
          };
          for (let i = 0; i < this.dummyLevels[dummyCurrentLevelNormal - 1].map.length; i++) {
            this.dummyLevels[dummyCurrentLevelNormal - 1].map[i].values = this.currentHolders[i];
          }
          this.dummyLevels[dummyCurrentLevelNormal - 1].map.push(newHolder);
          this.currentHolders.push([]);
          this.clearBalls();
          this.loadGame(dummyCurrentLevelNormal, this.dummyLevels);
        }
      } else {
        if (this.dummyLevels[dummyCurrentLevelHard - 1].map.length === 12) {
          cc.audioEngine.playEffect(this.sprayAudio, false);
        } else {
          let newHolder = {
            values: [],
          };
          for (let i = 0; i < this.dummyLevels[dummyCurrentLevelHard - 1].map.length; i++) {
            this.dummyLevels[dummyCurrentLevelHard - 1].map[i].values = this.currentHolders[i];
          }
          this.dummyLevels[dummyCurrentLevelHard - 1].map.push(newHolder);
          this.currentHolders.push([]);
          this.clearBalls();
          this.loadGame(dummyCurrentLevelHard, this.dummyLevels);
        }
      }
    } else {
      if (this.currentGameMode === 'easy') {
        if (this.dummyLevels[dummyCurrentLevelEasy - 1].map.length === 12) {
          cc.audioEngine.playEffect(this.sprayAudio, false);
        } else {
          let newHolder = {
            values: []
          };
          this.dummyLevels[dummyCurrentLevelEasy - 1].map.push(newHolder);
          this.clearBalls();
          this.loadGame(dummyCurrentLevelEasy, this.dummyLevels); 
        }
      } else if (this.currentGameMode === 'normal') {
        if (this.dummyLevels[dummyCurrentLevelNormal - 1].map.length === 12) {
          cc.audioEngine.playEffect(this.sprayAudio, false);
        } else {
          let newHolder = {
            values: []
          };
          this.dummyLevels[dummyCurrentLevelNormal - 1].map.push(newHolder);
          this.clearBalls();
          this.loadGame(dummyCurrentLevelNormal, this.dummyLevels); 
        }
      } else {
        if (this.dummyLevels[dummyCurrentLevelHard - 1].map.length === 12) {
          cc.audioEngine.playEffect(this.sprayAudio, false);
        } else {
          let newHolder = {
            values: []
          };
          this.dummyLevels[dummyCurrentLevelHard - 1].map.push(newHolder);
          this.clearBalls();
          this.loadGame(dummyCurrentLevelHard, this.dummyLevels); 
        }
      }
    }
  },

  getDataFromJson(mode) {
    return new Promise((resolve, reject) => {
      cc.loader.loadRes(mode, (err, data) => {
        if (err) {
          reject(err);
        } else {
          this.levels = data.json.levels;
          this.dummyLevels = JSON.parse(JSON.stringify(this.levels));
          resolve();
        }
      });
    });
  },

  loadGame(level, levels) {
    this.levelManagement(level, levels);
    let levelPassed = {
      easy: this.levelEasyPassed,
      normal: this.levelNormalPassed,
      hard: this.levelHardPassed,
    };
    cc.sys.localStorage.setItem("levelPassed", JSON.stringify(levelPassed));
  },

  levelManagement(level, levels) {
    if (this.currentGameMode === "easy") {
      this.gainLevel(this.currentLevelEasy);
    } else if (this.currentGameMode === "normal") {
      this.gainLevel(this.currentLevelNormal);
    } else {
      this.gainLevel(this.currentLevelHard);
    }
    this.loadLevel(levels, level);
  },

  loadLevel(levels, level) {
    cc.audioEngine.stopAllEffects();
    const holders = this.spawnHolderInLevel(levels, level);
    this.switchBall(holders);
  },

  spawnHolderInLevel(levels, no) {
    let spacingHolder = 140;
    let spacingBall = 200;
    let level = levels[no - 1].map;
    let holders = [];
    let holder;
    let distanceBetweenHolder = 0;
    let holderInRow1 = 0;
    let holderInRow2 = 0;
    let holderInRow3 = 0;
    let gamePlay = cc.find("game_play", this.node);
    if (level.length <= 4) {
      for (let i = 0; i < level.length; i++) {
        holder = this.spawnHolder(-200 + i * spacingHolder, distanceBetweenHolder);
        gamePlay.addChild(holder);
        if (level[i].values.length > 0) {
          for (let j = 0; j < level[i].values.length; j++) {
            let ball = this.spawnBall(0, 110 * j - spacingBall, level[i].values[j]);
            holder.addChild(ball);
          }
        }
        holders.push(holder);
      }
    } else if (level.length <= 8) {
      for (let i = 0; i < level.length; i++) {
        if (i < 4) {
          distanceBetweenHolder = 200;
          holder = this.spawnHolder(-200 + holderInRow1 * spacingHolder, distanceBetweenHolder);
          holderInRow1++;
        } else {
          distanceBetweenHolder = -200;
          holder = this.spawnHolder(-200 + holderInRow2 * spacingHolder, distanceBetweenHolder);
          holderInRow2++;
        }
        gamePlay.addChild(holder);
        if (level[i].values.length > 0) {
          for (let j = 0; j < level[i].values.length; j++) {
            if (level[i].values.length > 0) {
              let ball = this.spawnBall(0, 110 * j - spacingBall, level[i].values[j]);
              holder.addChild(ball);
            }
          }
        }
        holders.push(holder);
      }
    } else if (level.length <= 12) {
      for (let i = 0; i < level.length; i++) {
        if (i < 4) {
          distanceBetweenHolder = 320;
          holder = this.spawnHolder(-200 + holderInRow1 * spacingHolder, distanceBetweenHolder);
          holderInRow1++;
        } else if (i >= 4 && i < 8) {
          distanceBetweenHolder = -80;
          holder = this.spawnHolder(-200 + holderInRow2 * spacingHolder, distanceBetweenHolder);
          holderInRow2++;
        } else {
          distanceBetweenHolder = -480;
          holder = this.spawnHolder(-200 + holderInRow3 * spacingHolder,distanceBetweenHolder);
          holderInRow3++;
        }
        gamePlay.addChild(holder);
        if (level[i].values.length > 0) {
          for (let j = 0; j < level[i].values.length; j++) {
            let ball = this.spawnBall(0, 110 * j - spacingBall, level[i].values[j]);
            holder.addChild(ball);
          } 
        } 
        holders.push(holder);
      }
    }
    this.holdersInCurrentLevel = holders;
    return holders;
  },

  switchBall(holders) {
    let particleSystem = this.paperParticleHolder.getComponent(cc.ParticleSystem);
    let holder1;
    let holder2;
    let click = 0;
    let selectedBall = null;
    let startY;
    for (let holder of holders) {
      holder.on(cc.Node.EventType.TOUCH_START, () => {
        if (this.isMoving) {
          this.scheduleOnce(() => {
            this.isMoving = true;
          }, 0.5);
          click++;
          if (click === 1) {
            holder1 = holder;
            if (holder1._children.length === 0) {
              click = 0;
              cc.audioEngine.playEffect(this.sprayAudio, false);
            }
            selectedBall = holder1._children[holder1._children.length - 1];
            startY = holder1._children[holder1._children.length - 1].y;
            cc.tween(selectedBall).to(0.2, { position: cc.v2(0, holder1.height / 2 + 55) }).start();
            cc.audioEngine.playEffect(this.popAudio, false);
          } else if (click === 2) {
            holder2 = holder;
            if (holder1 === holder2) {
              cc.tween(selectedBall).to(0.2, { position: cc.v2(0, startY) }).start();
              cc.audioEngine.playEffect(this.pushAudio, false);
              click = 0;
            } else if (holder2._children.length >= 4) {
              cc.tween(selectedBall).to(0.2, { position: cc.v2(0, startY) }).start();
              cc.audioEngine.playEffect(this.pushAudio, false);
              click = 0;
            } else {
              let y = holder2._children.length > 0 ? holder2._children[holder2._children.length - 1].y + 100 : -200;
              if (selectedBall && (this.checkSameColor(selectedBall, holder2) || holder2._children.length === 0)) {
                selectedBall.removeFromParent();
                holder2.addChild(selectedBall);
                if (this.checkSameColorInHolder(holder2)) {
                  cc.audioEngine.playEffect(this.correctAudio, false);
                  particleSystem.node.setPosition(new cc.Vec2(holder2.x, holder2.y + 200));
                  this.paperParticleHolder.resetSystem();
                }
                cc.tween(selectedBall).to(0.2, { position: cc.v2(0, y + 10) }).start();
                cc.audioEngine.playEffect(this.pushAudio, false);
                selectedBall = null;
                click = 0;
              } else {
                cc.tween(selectedBall).to(0.2, { position: cc.v2(0, startY) }).start();
                click = 0;
                cc.audioEngine.playEffect(this.sprayAudio, false);
              }
            }
          }
          let arr = [];
          for (let i = 0; i < holders.length; i++) {
            let temp = [];
            for (let j = 0; j < holders[i]._children.length; j++) {
              let str = holders[i]._children[j].getComponent(cc.Sprite)._spriteFrame._name;
              temp.push(+str.charAt(str.length - 1) - 1);
            }
            arr.push(temp);
          }
          this.currentHolders = arr;
          if (this.checkConditionalWin(holders)) {
            cc.audioEngine.playEffect(this.successAudio, false);
            this.paperParticleHolder.stopSystem();
            this.paperParticle.resetSystem();
            this.victory();
            click = 3;
          }
        }
      });
    }
  },

  prev() {
    cc.audioEngine.playEffect(this.clickAudio, false);
    this.currentHolders = [];
    if (this.currentGameMode === "easy" && this.currentLevelEasy > 1) {
      this.clearBalls();
      this.currentLevelEasy--;
      this.loadGame(this.currentLevelEasy, this.levels);
    } else if (
      this.currentGameMode === "normal" &&
      this.currentLevelNormal > 1
    ) {
      this.clearBalls();
      this.currentLevelNormal--;
      this.loadGame(this.currentLevelNormal, this.levels);
    } else if (this.currentGameMode === "hard" && this.currentLevelHard > 1) {
      this.clearBalls();
      this.currentLevelHard--;
      this.loadGame(this.currentLevelHard, this.levels);
    }
  },

  clearBalls() {
    let playGameNode = cc.find("game_play", this.node);
    for (let i = 0; i < playGameNode._children.length; i++) {
      if (playGameNode._children[i]._name === "holder") {
        playGameNode._children[i].destroy();
      }
    }
  },

  next() {
    this.currentHolders = [];
    if (this.currentGameMode === "easy") {
      if (this.currentLevelEasy <= this.levels.length) {
        this.clearBalls();
        this.currentLevelEasy++;
        this.levelEasyPassed = this.currentLevelEasy;
        this.loadGame(this.currentLevelEasy, this.levels);
      }
    } else if (this.currentGameMode === "normal") {
      if (this.currentLevelNormal <= this.levels.length) {
        this.clearBalls();
        this.currentLevelNormal++;
        this.levelNormalPassed = this.currentLevelNormal;
        this.loadGame(this.currentLevelNormal, this.levels);
      }
    } else {
      if (this.currentLevelHard <= this.levels.length) {
        this.clearBalls();
        this.currentLevelHard++;
        this.levelHardPassed = this.currentLevelHard;
        this.loadGame(this.currentLevelHard, this.levels);
      }
    }
  },

  reset() {
    this.currentHolders = [];
    this.dummyLevels = JSON.parse(JSON.stringify(this.levels));
    if (this.currentGameMode === "easy") {
      this.clearBalls();
      this.loadGame(this.currentLevelEasy, this.levels);
    } else if (this.currentGameMode === "normal") {
      this.clearBalls();
      this.loadGame(this.currentLevelNormal, this.levels);
    } else {
      this.clearBalls();
      this.loadGame(this.currentLevelHard, this.levels);
    }
  },

  spawnHolder(x, y) {
    let holder = cc.instantiate(this.holderPrefabs);
    holder.setPosition(cc.v2(x, y));
    return holder;
  },


  spawnBall(width, height, type) {
    let ball = cc.instantiate(this.ballPrefabs);
    ball.setPosition(width, height);
    ball.getComponent("ball").type = type;
    return ball;
  },

  checkSameColor(ball, holder) {
    if (holder._children.length > 0) {
      let holderColor = holder._children[holder._children.length - 1].getComponent(cc.Sprite)._spriteFrame._name;
      let ballColor = ball.getComponent(cc.Sprite)._spriteFrame._name;
      return holderColor === ballColor;
    }
    return false;
  },

  checkSameColorInHolder(holder) {
    if (holder._children.length != 4) return false;
    let checkBall = holder._children[0].getComponent(cc.Sprite)._spriteFrame._name;
    for (let i = 0; i < holder._children.length; i++) {
      if (checkBall !== holder._children[i].getComponent(cc.Sprite)._spriteFrame._name) {
        return false;
      }
    }
    return true;
  },

  checkConditionalWin(holders) {
    for (let i = 0; i < holders.length; i++) {
      if (holders[i]._children.length === 0) continue;
      if (holders[i]._children.length !== 4) return false;
      let ballCheck = holders[i]._children[0].getComponent(cc.Sprite)._spriteFrame._name;
      for (let j = 1; j < holders[i]._children.length; j++) {
        if (ballCheck !== holders[i]._children[j].getComponent(cc.Sprite)._spriteFrame._name) {
          return false;
        }
      }
    }
    return true;
  },
});
