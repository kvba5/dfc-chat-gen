import miscStyles from "@/style/menu/misc.module.css"

import Image from "next-export-optimize-images/image"
import { useCallback, useEffect, useState } from "react"

import ChatGenerator from "@/helpers/generator"
import Loader from "../loader"
import { ControlledColorPicker } from "../helper"
import { AudioManager } from "@/helpers/audio"

function DownloadBtn({ url, isAnimated }: { url: string, isAnimated: boolean }) {
    const audioManager = AudioManager.getInstance()
    const [saved, setSaved] = useState(false)
    
    useEffect(() => {
        audioManager.preloadAudio("save2")
    }, [audioManager])

    const handleDownload = () => {
        if(saved) return;
        
        const el = document.createElement("a")
        el.href = url;
        el.download = `chat.${isAnimated ? "gif" : "jpg"}`;

        el.click()
        setSaved(true)
        audioManager.getAudio("save2")?.play()

        setTimeout(() => setSaved(false), 2000);
    }

    return <button onClick={handleDownload} className={`place-self-center ${miscStyles["rainbow"]} p-2 min-w-32`}>{!saved ? "Save Image" : "Saved!"}</button>
}


type Props = {
    playerName: string,
    message: string,
    character: string,
    face: number
}

export default function PreviewComponent({ playerName, message, character, face }: Props) {
    const audioManager = AudioManager.getInstance()

    const [nameColor, setNameColor] = useState("#FFFFFF")
    const [messageColor, setMessageColor] = useState("#FFFFFF")
    const [isAnimated, setAnimated] = useState(false)
    
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isLoading, setLoading] = useState(true)



    const chatGenerator = useCallback(() =>
        new ChatGenerator({ playerName, message, character, face, nameColor, messageColor }),
    [playerName, message, character, face, nameColor, messageColor])

    useEffect(() => {
        const startGenerating = async () => {
            setLoading(true)

            const generator = chatGenerator()
            if (!isAnimated) {
                const canvas = await generator.generate()
                setImageUrl(generator.asDataUrl(await generator.asBlob(canvas)))
            } else setImageUrl(generator.asDataUrl(await generator.generateAnimated()))

            audioManager.getAudio("equip")?.play()
            setLoading(false)
        }
        
        startGenerating()
    }, [audioManager, chatGenerator, isAnimated])

    return <div className="flex flex-col gap-10 justify-center place-self-center w-3/4 min-w-96 select-none">
        {isLoading ? <Loader /> : <>
            <div className="flex flex-col gap-1 justify-center">
                <span className="text-textsecond text-sm">Result</span>
                {imageUrl && <Image height={256} width={96} alt="Result" src={imageUrl} className="h-24 w-full pixelated object-contain" />}
            </div>
            <div className="flex flex-col gap-1">
                {/* TODO: fix settings scaling */}
                <span className="text-textsecond text-sm">Options</span>
                <div className="grid grid-cols-3 text-xl *:*:align-middle *:flex *:flex-row *:gap-2 w-1/2 place-self-center place-items-center">
                    <div><ControlledColorPicker onPicked={(c) => setNameColor(c)} defaultValue={nameColor} /><span>Name Color</span></div>
                    <div><ControlledColorPicker onPicked={(c) => setMessageColor(c)} defaultValue={messageColor} /><span>Message Color</span></div>
                    <div><input defaultChecked={isAnimated} onChange={e => setAnimated(e.currentTarget.checked)} type="checkbox" /><span>Is animated?</span></div>
                </div>
            </div>
            {imageUrl && <DownloadBtn url={imageUrl} isAnimated={isAnimated} />}
        </>}
    </div>
}