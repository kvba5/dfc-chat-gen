"use client"

import type { CSSProperties } from "react"

import BattleBg from "#/img/battle-bg.png"
import CharaDown from "#/img/spr_chara_down_2.png"
import CharaAltDown from "#/img/spr_chara_down_2alt.png"

import Image from "next-export-optimize-images/image"
import { useEffect, useMemo, useRef, useState } from "react"

import { animate } from "@/helpers/animation"
import useDialog from "@/components/dialogText"
import { AudioManager } from "@/helpers/audio"

const calculateHp = (lv: number) => lv < 20 ? (16 + (4* lv)) : 99

const NobodyCameScreen = ({ level }: { level: number }) => {
    const div = useRef<HTMLDivElement>(null)
    const [dialogText, startDialog] = useDialog("* But nobody came...[wait=5000]?[wait=5000] There's nothing here... You can leave.", { speed: 100 })
    const maxHp = useMemo(() => calculateHp(level), [ level ])
    const [hp, setHp] = useState(maxHp)
    
    useEffect(() => {
        setHp(Math.round(Math.random() * (maxHp - 1) + 1))
    }, [maxHp])

    useEffect(() => {
        if (!div.current) return;
        
        animate(div.current, [
            {opacity: 0},
            {opacity: 1}
        ], {
            delay: 1000,
            duration: 6000,
            easing: "linear",
            fill: "forwards"
        })

        const t = setTimeout(() => startDialog(), 2000)
        return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div ref={div} className="flex flex-col gap-10 w-screen h-screen justify-center items-center p-10 opacity-0 select-none" onDragStart={e=>e.preventDefault()}>
        <audio controls loop><source src="/audio/mus_toomuch.ogg" type="audio/ogg" /></audio>
        <div className="flex flex-col h-1/2 aspect-[4/3] border-white border-2">
            <Image alt="" src={BattleBg} className="px-3 py-2" />
            <div className="flex flex-col w-full h-1/2">
                <div className="flex flex-col gap-1 px-5">
                    <div className="border-white border-4 h-24 w-full px-2 py-1">
                        <span className="text-xs tracking-widest">{dialogText}</span>
                    </div>
                    <div className="flex flex-row uppercase gap-20 font-toublebenaththedome">
                        <div className="flex flex-row gap-5">
                            <span>You</span>
                            <span>lv {level}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="text-xs tracking-wider">HP</span>
                            <div className="flex h-3/4 w-8 bg-[#f00]"><div style={{ "--hp-length": `${Math.round(hp/maxHp * 100)}%` } as CSSProperties} className="bg-[#ff0] w-[--hp-length]"></div></div>
                            <div>{hp} / {maxHp}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}


const detectBrowser = () => {
    if (navigator.userAgentData && navigator.userAgentData.brands.length > 0) return navigator.userAgentData.brands[0].brand
    if (navigator.userAgent.includes("Chrome")) {
        if (navigator.brave?.isBrave) return "Brave"
        return "Chrome"
    }
    if (navigator.userAgent.includes("Firefox")) return "Firefox"
    return "Browser"
}

const dialog = [
    "Greetings.",
    "I[wait=400] am Chara.",
    "We are meeting again, partner.",
    "Remember our amazing adventure years ago, \"You\"?",
    "It was a pleasure working together.",
    "I didn't like the part where you betrayed me though, \"You\".",
    "...",
    `\"%url\"?`,
    `...\"%browser\"?`,
    "Is this another attempt of betraying me?",
    "I hope it is not.",
    "Anyways, I hope you will do your best this time.",
    "I'm counting on you, partner."
] as const

function UnexpectedGuestScreen() {
    const audioManager = AudioManager.getInstance()
    const [isAlt, setIsAlt] = useState(true)
    const [dialogFinished, setDialogFinished] = useState(false)
    const [dialogRunning, setDialogRunning] = useState(false)
    const [currentDialog, setDialog] = useState(0)
    const [dialogText, startDialog] = useDialog(
        dialog[currentDialog]
            .replaceAll("%url", location.hostname)
            .replaceAll("%browser", detectBrowser()),
        { speed: 100 }
    )

    useEffect(() => {
        const handleNextDialog = async () => {
            // Alt Chara
            if ([5, 9, 10].includes(currentDialog)) setIsAlt(true);
            else if(isAlt) setIsAlt(false);

            // mus_zzz_c SFX play/resume/stop
            if (currentDialog === 2) audioManager.preloadAudio("mus_zzz_c")
            if ([3].includes(currentDialog)) audioManager.getAudio("mus_zzz_c")?.playLoop();
            if ([6].includes(currentDialog)) audioManager.getAudio("mus_zzz_c")?.pause();
            if ([9].includes(currentDialog)) audioManager.getAudio("mus_zzz_c")?.resume();

            const [promise] = startDialog()

            setDialogRunning(true)
            await promise;
            setDialogRunning(false)
        }

        handleNextDialog()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDialog])

    useEffect(() => {
        const continueDialog = () => {
            if (dialogRunning) return;
            if (currentDialog + 1 === dialog.length) return setDialogFinished(true);
    
            console.log(dialog[currentDialog + 1])
            setDialog(currentDialog + 1)
        }

        if(dialogFinished) {
            document.removeEventListener("click", continueDialog)
            audioManager.getAudio("mus_zzz_c")?.pause()
            window.open("https://www.youtube.com/watch?v=Jd8w8iPWGM8", "_blank", `popup=yes,width=${Math.round(window.screen.availWidth/2)},height=${Math.round(window.screen.availHeight/2)},noopener=yes,noreferrer=yes`)
        }
        else {
            document.addEventListener("click", continueDialog)
            return () => document.removeEventListener("click", continueDialog)
        } 
    }, [currentDialog, dialogRunning, dialogFinished, audioManager])

    if (dialogFinished) return;
    return <div className="*:fixed *:left-1/2 *:top-1/2 *:-translate-x-1/2 *:-translate-y-1/2 text-3xl select-none" onDragStart={e=>e.preventDefault()}>
        <Image alt="" src={isAlt ? CharaAltDown : CharaDown} height={100} priority className="pixelated" />
        <div className="!top-3/4 w-72">
            <span>{dialogText}</span>
            {!dialogRunning && <span className="text-textsecond opacity-50 text-sm ml-3">[Click]</span>}
        </div>
    </div>
}

export default function NotFound() {
    const [level, setLevel] = useState<number | null>(null);
    

    useEffect(() => {
        const KEY = "easter:level"

        const lv = (() => {
            const lv = parseInt(localStorage.getItem(KEY) ?? "1") ?? 1
            return lv < 1 ? 1 : lv > 20 ? 20 : lv
        })()
        setLevel(lv)
        localStorage.setItem(KEY, String(lv + 1))
    }, [])

    useEffect(() => {
        const eventsToPrevent: (keyof DocumentEventMap)[] = ["contextmenu", "keydown", "keypress", "keyup"]
        const preventDefault = (e: Event) => e.preventDefault()

        eventsToPrevent.forEach(ev => {
            document.addEventListener(ev, preventDefault)
            window.addEventListener(ev, preventDefault)
        })
        return () => {
            eventsToPrevent.forEach(ev => {
                document.removeEventListener(ev, preventDefault)
                window.removeEventListener(ev, preventDefault)
            })
        }
    }, [])

    if (!level) return;
    return level < 20 ? <NobodyCameScreen level={level} /> : <UnexpectedGuestScreen />
}