// Audio-only settings: video times are seconds in each original source clip.
window.HALLOWEEN_GACHA_AUDIO_CONFIG={
 bgm:'assets/events/halloween2026/audio/gacha-bgm.mp3',bgmVolume:.12,seVolume:.55,
 effects:{
  operation:{file:'assets/events/halloween2026/audio/operation.wav',volume:.75},
  capsule:{file:'assets/events/halloween2026/audio/capsule.wav',volume:1},
  opening:{file:'assets/events/halloween2026/audio/opening.wav',volume:.85},
  reward:{file:'assets/events/halloween2026/audio/reward.wav',volume:1}
 },
 cues:{operationStart:0,operationEnd:10.5,capsule:10.5,opening:4.05}
 // Reward cue follows the existing showResult callback, not a separate timer.
};
