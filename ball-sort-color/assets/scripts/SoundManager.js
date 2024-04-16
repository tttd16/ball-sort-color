// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let objAudioClip = {};

const  SoundManager = cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    statics: {
        getIns() {
            if (!this.self) {
                this.self = new SoundManager();
            }
            return this.self;
        }
    },

    start () {

    },

    popBallClick() {
        cc.resources.load('sounds/pop_sound_effect', cc.AudioClip, (err, clip) => {
            if (err) return;
            objAudioClip['SoundClick'] = cc.audioEngine.play(clip, false, 1);
        });
    },

    pushBallClick() {
        cc.resources.load('sounds/push_sound_effect', cc.AudioClip, (err, clip) => {
            if (err) return;
            objAudioClip['SoundClick'] = cc.audioEngine.play(clip, false, 1);
        });
    },

    spray() {
        cc.resources.load('sounds/spray', cc.AudioClip, (err, clip) => {
            if (err) return;
            objAudioClip['SoundClick'] = cc.audioEngine.play(clip, false, 1);
        })
    },

    correct() {
        cc.resources.load('sounds/Correct', cc.AudioClip, (err, clip) => {
            if (err) return;
            objAudioClip['SoundClick'] = cc.audioEngine.play(clip, false, 1);
        })
    },

    // update (dt) {},
});

export default SoundManager;
