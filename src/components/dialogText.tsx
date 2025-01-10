import { waitFor } from "@/helpers/misc"

import { useCallback, useMemo, useState } from "react"

enum Modifiers {
    SPEED = "speed",
    WAIT = "wait"
}

const MODIFIER_REGEX = /\[(\w+)=([\w\d ]+)\]/

const parseModifier = (text: string) => {
    const match = text.match(MODIFIER_REGEX)
    if(!match) return null;
    
    const [name, value] = match.slice(1, 3);
    return {name, value}
}


type Settings = {
    /** Speed (in ms) how fast will text advance */
    speed: number
    /** Ignores interpunction addition delay */
    staticSpeed: boolean
}


const DEFAULT_SETTINGS: Settings = {
    speed: 30,
    staticSpeed: false
}


export default function useDialog(text: string, s?: Partial<Settings>): [
    string,
    () => [Promise<unknown>, () => boolean]
] {
    const [ currentText, setCurrentText ] = useState("");
    const [isDialogRunning, setIsDialogRunning] = useState(false)

    const settings: Settings = useMemo(() => ({
        ...DEFAULT_SETTINGS,
        ...s
    }), [s])

    const textChunks = useMemo(() => {
        let modifierMode = false
        let buildChunk = ""

        return text.split("").reduce((t, c) => {
            buildChunk += c;
    
            if (/\s/.test(c)) return t;
            if (c === "[" && !modifierMode) {
                modifierMode = true
                return t;
            }
            if (c === "]" && modifierMode) modifierMode = false;
            else if (modifierMode) return t;
            
            t.push(buildChunk)
            buildChunk = ""
    
            return t;
        }, new Array<string>())
    }, [text])

    const startDialog = useCallback((): [Promise<unknown>, () => boolean] => {
        if(isDialogRunning) return [Promise.resolve(), () => false]
        setIsDialogRunning(true)

        const instanceSettings = settings;
        let skipped = false;

        const handleModifiers = async (chunk: string) => {
            const modifier = parseModifier(chunk);
            if(!modifier) return false;
            const { name, value } = modifier;

            switch(name.toLowerCase()) {
                case Modifiers.SPEED: {
                    if (!/\d+/.test(value)) break;
                    instanceSettings.speed = parseInt(value)
                    break;
                }
                case Modifiers.WAIT: {
                    if (!/\d+/.test(value)) break;
                    await waitFor(parseInt(value))
                    break;
                }
            }
            
            return true;
        }

        const finishIfSkipped = () => {
            if (!skipped) return false;
            setCurrentText(textChunks.join(""))
            return true
        }

        const skipDialog = () => {
            if (skipped) return false;
            return skipped = true
        }

        const promise = new Promise(async (r) => {
            if (!finishIfSkipped()) {
                setCurrentText("")
                for (const chunk of textChunks) {
                    if(finishIfSkipped()) break; // Triggered skipDialog
                    if(await handleModifiers(chunk)) continue; // Modifier detected [name=value]

                    // Internal speed manipulation (characters)
                    let speed = instanceSettings.speed
                    if (!instanceSettings.staticSpeed) {
                        if (chunk === ".") speed += 300
                        else if (chunk === ",") speed += 100
                    }

                    setCurrentText(currentText => currentText + chunk)
                    await waitFor(speed)
                }
            }

            setIsDialogRunning(false)
            r(true)
        })

        return [promise, skipDialog] as const
    }, [isDialogRunning, textChunks, settings])


    return [
        currentText,
        startDialog
    ] as const
}