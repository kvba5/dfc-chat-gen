import type { ComponentPropsWithoutRef } from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "../helper"

export const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
export const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz"
export const SPECIAL_CHARACTERS = "0123456789_-"

const DEFAULT_CHARACTERS: string[] = [
    UPPERCASE_LETTERS,
    LOWERCASE_LETTERS,
    SPECIAL_CHARACTERS
]


const SHAKE_POWER = 3

function ShakingCharacter(props: ComponentPropsWithoutRef<"span">) {
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            if (!ref.current) return;

            ref.current.style.translate = `${Math.random() * SHAKE_POWER}px ${Math.random() * SHAKE_POWER}px`
        }, 50)

        return () => clearInterval(interval)
    }, [])
    
    return <span ref={ref} {...props} />
}

type Props = {
    title?: string,
    characters?: string[],
    characterLimit?: number,
    onBack?: () => void,
    onDone?: (text: string) => void
}

export default function UndertaleKeypad({
    title = "Name the fallen human",
    characters = DEFAULT_CHARACTERS,
    characterLimit = 99,
    onBack,
    onDone
}: Props) {
    const [value, setValue] = useState("")

    const handleBack = useCallback(() => {
        if (!onBack) return;

        onBack()
        setValue("")
    }, [onBack])

    const handleDone = useCallback(() => {
        if (!onDone) return;

        onDone(value)
        setValue("")
    }, [onDone, value])

    // Keyboard
    useEffect(() => {
        const chars = characters.join("")

        const handleKey = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Backspace":
                    e.preventDefault()
                    return setValue(v => v.slice(0, v.length-1))
                case "Escape": return handleBack()
                case "Enter": return handleDone()
            }
            if (!e.repeat && chars.includes(e.key)) {
                e.preventDefault()
                return setValue(v => v + e.key)
            }
        }
        
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [characters, handleBack, handleDone])

    useEffect(() => {
        setValue(value.slice(0, characterLimit))
    }, [value, characterLimit])

    return <div className="flex flex-col text-2xl gap-5 select-none text-center">
        <div className="flex flex-col">
            <span className="text-sm translate-y-2 text-textsecond">(You can use your keyboard)</span>
            <span>{title}</span>
        </div>
        <span className="whitespace-pre">{value}</span>
        <div className="flex flex-col w-1/2 gap-8 self-center content-center items-center">
            {characters.map((row, i) => <div className="grid gap-x-14 grid-cols-7" key={`keypad-row-${i}`}>
                {row.split("").map((c, ii) => <ShakingCharacter onClick={() => setValue(value + c)} className="hover:text-primary active:text-primarysecond" key={`keypad-${i}-${ii}`}>{c}</ShakingCharacter>)}
            </div>)}
        </div>
        <div className="flex flex-row gap-12 self-center">
            {onBack && <Button onClick={handleBack} className="hover:text-primary active:text-primarysecond">Back</Button>}
            <Button className="hover:text-primary active:text-primarysecond" onClick={() => setValue(value.slice(0, value.length-1))}>Backwards</Button>
            {onDone && <Button onClick={handleDone} className="hover:text-primary active:text-primarysecond">Done</Button>}
        </div>
    </div>
}