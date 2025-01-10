import { encode } from "modern-gif"

const GIF_WORKER_URL = "/workers/modern-gif/worker.js"

/** Creates Image element with source and waits for it to load */
const loadImage = (src: string): Promise<HTMLImageElement> => {
    const img = new Image()
    img.src = src;
    
    return new Promise(r => {
        const finishedLoading = () => r(img)

        if (img.complete) finishedLoading()
        else img.addEventListener("load", () => finishedLoading(), {once: true})
    })
}

/** Grabs image data asynchronously */
const asyncBlob = (canvas: HTMLCanvasElement, type = "image/jpeg"): Promise<Blob | null> => new Promise(r => canvas.toBlob(r, type))

type ChatGeneratorOptions = {
    playerName: string,
    message: string,
    character: string,
    face: number,
    nameColor: string,
    messageColor: string
}

export default class ChatGenerator {
    playerName: string;
    message: string;
    character: string;
    face: number;
    nameColor: string;
    messageColor: string;
    
    imageRatio: number = 3;
    
    /** Was current message already measured? (Useful when generating animated) */
    private messageMeasured = false;

    /** Measures and slices the message to the width of image */
    private calculateMessage(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        while (
            ctx.measureText(this.message).width > canvas.width - (45 * this.imageRatio)
        ) this.message = this.message.slice(0, -1)
        this.messageMeasured = true
    }

    constructor({ playerName, message, character, face, nameColor, messageColor }: ChatGeneratorOptions) {
        this.playerName = playerName;
        this.message = message;
        this.character = character;
        this.face = face;
        this.nameColor = nameColor;
        this.messageColor = messageColor;
    }

    async asBlob(canvas: HTMLCanvasElement) {
        const blob = await asyncBlob(canvas);
        if (!blob) throw new Error("Could not get blob of the image!")
        return blob;
    }

    asDataUrl(blob: Blob) {
        return URL.createObjectURL(blob)
    }

    async generate(text?: string) {
        // Preparing
        const [bgImage, characterImage] = await Promise.all([
            // Images
            loadImage("/img/spr_rp_localmsg_0.png"),
            loadImage(`/img/faces/${this.character}/${this.character}_${this.face}.png`)
        ])

        const canvas = document.createElement("canvas")
        canvas.height = bgImage.naturalHeight * this.imageRatio
        canvas.width = bgImage.naturalWidth * this.imageRatio

        const ctx = canvas.getContext("2d")!
        ctx.imageSmoothingEnabled = false;

        // Drawing
        // Background
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)

        // Character
        const imgRatio = characterImage.width / characterImage.height
        const iconWidth = 25, iconHeight = 24, iconRatio = iconWidth / iconHeight
        let width, height;
        if (imgRatio > iconRatio) {
          width = iconWidth;
          height = iconWidth / imgRatio;
        } else {
          width = iconHeight * imgRatio;
          height = iconHeight;
        }
        
        const x = 5 + (iconWidth - width) / 2;
        const y = 5 + iconHeight - height;
        ctx.drawImage(
            characterImage,
            x * this.imageRatio,
            y * this.imageRatio,
            width * this.imageRatio,
            height * this.imageRatio
        )

        // name
        ctx.fillStyle = this.nameColor
        ctx.textBaseline = "top"
        let fontSize = 7 * this.imageRatio
        ctx.font = `${fontSize}px "troubleBenathTheDome"`
        ctx.fillText(
            `[${this.playerName}]:`,
            38 * this.imageRatio,
            7 * this.imageRatio
        )

        // msg
        fontSize = 15 * this.imageRatio
        ctx.fillStyle = this.messageColor
        ctx.font = `${fontSize}px "determinationMono"`
        if (!this.messageMeasured) this.calculateMessage(canvas, ctx)
        ctx.fillText(
            text ?? this.message,
            38 * this.imageRatio,
            13 * this.imageRatio
        )

        return canvas
    }

    async generateAnimated() {
        const frames = await (async () => {
            // Generating first frame manually to calculate message
            await this.generate()

            let c: Promise<HTMLCanvasElement>[] = []
            const chunks = Array.from({ length: this.message.length + 1 }, (_, i) => this.message.slice(0, i)).reduce<Promise<HTMLCanvasElement>[][]>((arr, str, i, oarr) => {
                const promise = this.generate(str)
                c.push(promise)

                if (c.length < 5 && i+1 !== oarr.length) return arr;

                arr.push(c)
                c = []
                return arr;
            }, [])
            
            const frames: HTMLCanvasElement[] = []
            for (const chunk of chunks) frames.push(...await Promise.all(chunk))
            return frames
        })()
        
        const { width, height } = frames[0]
        const buffer = await encode({
            workerUrl: GIF_WORKER_URL,
            width, height,
            looped: false,
            // \/ I love canvas. if something fails here then you know why
            frames: frames.map(f => ({
                data: f.getContext("2d")!.getImageData(0, 0, width, height).data,
                delay: 50
            }))
        })

        const blob = new Blob([buffer], { type: "image/gif" })
        if (!blob) new Error("Could not get blob of the image!")
        return blob
    }
}