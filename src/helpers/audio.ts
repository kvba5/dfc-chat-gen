import { waitFor } from "./misc";

class AudioInstance {
    private src: string;
    private audio: HTMLAudioElement | null = null;
    private isLoading = false;

    public constructor(src: string) {
        this.src = src;
    }

    public loadAudio() {
        if (this.audio) return this.audio
        return this.audio = new Audio(this.src)
    }

    public async loadAudioAsync(): Promise<HTMLAudioElement> {
        while (this.isLoading) await waitFor(100)
        if (this.audio) return this.audio
        this.isLoading = true;

        return this.audio = await new Promise(r => {
            const onLoaded = () => {
                this.isLoading = false
                r(audio)
            }

            const audio = new Audio(this.src)
            if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) onLoaded()
            else audio.addEventListener("loadeddata", onLoaded, { once: true })
        }) as HTMLAudioElement
    }

    public play() {
        const audio = this.loadAudio()

        audio.currentTime = 0
        audio.play()
    }

    public playLoop() {
        const audio = this.loadAudio()

        audio.loop = true;
        audio.currentTime = 0
        audio.play()
    }

    public resume() {
        const audio = this.loadAudio()
        audio.play()
    }

    public pause() {
        const audio = this.loadAudio()
        audio.pause()
    }
}

export class AudioManager {
    private static instance: AudioManager;

    private audioMap = new Map<string, AudioInstance>();
    
    private constructor() {
        this.loadAudio("blip", "audio/snd_blip.wav")
        this.loadAudio("select", "audio/snd_select.wav")
        this.loadAudio("equip", "audio/snd_equip.wav")
        this.loadAudio("save2", "audio/snd_save2.wav")
        this.loadAudio("mus_zzz_c", "audio/mus_zzz_c.ogg")
    }
    
    public static getInstance() {
        if (AudioManager.instance) return AudioManager.instance
        return AudioManager.instance = new AudioManager()
    }

    private loadAudio(name: string, src: string) {
        if (!this.audioMap.has(name)) {
            this.audioMap.set(name, new AudioInstance(src))
        }
    }

    public getAudio(name: string) {
        const audio = this.audioMap.get(name)
        if (!audio) return null;
        return audio;
    }

    public async preloadAudio(...names: string[]) {
        return await Promise.all(names.map(n => this.getAudio(n)?.loadAudioAsync()))
    }

}