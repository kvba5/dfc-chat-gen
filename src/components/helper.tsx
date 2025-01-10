import { AudioManager } from "@/helpers/audio";
import type { ComponentPropsWithoutRef } from "react"

import { useEffect, useRef } from "react";

type Props = {
    onPicked?: (color: string) => void,
    defaultValue?: string
}

export function ControlledColorPicker({ onPicked, defaultValue }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    
    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;

        const handleColorChange = () => onPicked?.(el.value)
        
        el.addEventListener("change", handleColorChange)
        return () => el.removeEventListener("change", handleColorChange)
    }, [ref, onPicked])

    return <input defaultValue={defaultValue} ref={ref} type="color" />
}

export function Button(props: ComponentPropsWithoutRef<"span">) {
    const audioManager = AudioManager.getInstance()
    
    useEffect(() => {
        audioManager.preloadAudio("select", "blip")
    }, [audioManager])

    return <span {...props} onMouseEnter={() => audioManager.getAudio("blip")?.play()} onClick={(e) => {
        props.onClick?.(e)
        audioManager.getAudio("select")?.play()
    }} />
}