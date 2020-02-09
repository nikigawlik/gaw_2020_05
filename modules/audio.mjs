let audioCtx = new AudioContext();
let master = audioCtx.createGain();
master.gain.setValueAtTime(0.35, audioCtx.currentTime); // keep it civil!
master.connect(audioCtx.destination);

function createSoundBuffer(func, length = 1, srate = 8000) {
    length *= srate;
    let buffer = audioCtx.createBuffer(1, length, srate);
    let data = buffer.getChannelData(0);
    
    for(let t = 0; t < length; t++) {
        data[t] = func(t, length, srate, data);
    }

    return buffer;
}

function playSound(buffer) {
    let source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(master);
    source.start();
}


// acutal sounds!

let clack = createSoundBuffer((t, length, srate, data) => {
    let x = t / length * 1000;
    const off = 100;
    const atk = 4;
    let env = x < atk ? x/atk : 1/(1+x-atk);
    env = Math.max(0, env-0.1);
    return Math.sin(t / srate * Math.PI * 2 * 1000) * env;
});

export function playClack() {
    playSound(clack);
}