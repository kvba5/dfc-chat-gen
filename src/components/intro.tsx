import type { Dispatch, SetStateAction } from "react"

import HarlowNotice from "#/img/spr_harlownotice_0.png"

import Image from "next-export-optimize-images/image"
import { useEffect, useRef, useState } from "react";

import useDialog from "./dialogText";
import { animate } from "@/helpers/animation";
import { waitFor } from "@/helpers/misc";

type Props = {
    enableIntro: Dispatch<SetStateAction<boolean>>
}

function NoticeBox({ enableIntro }: Props) {
    const [canContinue, setCanContinue] = useState(false)
    const [ noticeText, startDialog ] = useDialog(
        "Before you continue, anything here is not official, any content here (sprite/audio/etc.) is not mine and is owned by it's original creators (credits in footer).",
        {
            staticSpeed: true
        }
    );
    const div = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const begin = async () => {
            if (!div.current) return;
            let skipped = false;
            let runningDialog: ReturnType<typeof startDialog> | null = null;

            const skip = () => skipped = runningDialog?.[1]?.() ?? true // runningDialog doesn't exist when animation didn't finish
            div.current.addEventListener("click", skip, { once: true })
            
            await animate(div.current, [
                {opacity: 0},
                {opacity: 1}
            ], {
                duration: 1000,
                fill: "forwards"
            })
    
            if (!skipped) {
                await waitFor(300)
                runningDialog = startDialog()
                await runningDialog[0]; // promise
            } else {
                runningDialog = startDialog()
                runningDialog[1]() // instantly skip to fill element with text
            }

            if (!skipped) {
                div.current.removeEventListener("click", skip)
                await waitFor(300)
            }
    

            setCanContinue(true)
        }

        begin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleEnter = async () => {
        if (!canContinue || !div.current) return;
        setCanContinue(false)

        await animate(div.current, [
            {opacity: 1},
            {opacity: 0}
        ], {
            duration: 1000,
            fill: "forwards"
        })

        await waitFor(1000)
        enableIntro(false)
    }

    return <div className="flex flex-col opacity-0 gap-10 justify-center items-center w-full h-full" ref={div} onClick={handleEnter}>
        <Image priority className="pixelated" alt="Notice Image" src={HarlowNotice} height={200} onDragStart={(e)=>e.preventDefault()} />
        <div className="flex flex-col gap-3 text-3xl w-1/2 min-w-80 text-center">
            <span className="leading-8">{noticeText}</span>
            {canContinue && <span className="text-textsecond">[Click to Enter]</span>}
        </div>
    </div>
}

export default function Intro(props: Props) {
    return <div className="fixed bg-black left-0 top-0 w-screen h-screen select-none justify-center items-center content-center">
        <NoticeBox {...props} />
    </div>
}