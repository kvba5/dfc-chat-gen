import type { CSSProperties } from "react"

import style from "@/style/menu/characterPicker.module.css"

import groupsMetadata from "@/groupsMetadata.json"
const { groups, count } = groupsMetadata

import FaceArrowIcon from "#/img/spr_rp_localmsg_arrow.png"

import Image from "next-export-optimize-images/image"
import { useState } from "react"
import { AudioManager } from "@/helpers/audio"

export const DEFAULT_CHARACTER = "spr_rp_unknown"

const COLORS = ["#f41515", "#15daf4", "#f4ed15", "#15f43a", "#FFFFFF"]

function CharacterPreview ({ name, face, className, size = 70, onSelect }: { name: string, face: number, className?: string, size?: number, onSelect?: () => void }) {
    const audioManager = AudioManager.getInstance()
    return <Image onMouseEnter={() => audioManager.getAudio("blip")?.play()} onClick={() => audioManager.getAudio("select")?.play() || onSelect?.()} className={"pixelated border-white hover:border-primary border-[3px] bg-[url(/img/char-bg.png)] bg-no-repeat bg-cover bg-center object-bottom " + (className ?? "")} loading="lazy" decoding="async" width={size} height={size} alt="" src={`/img/faces/${name}/${name}_${face}.png`} />
}


type Category = keyof typeof groups
type Props = {
    onSelect: (character: string, face: number) => void
}

export default function CharacterPicker({ onSelect }: Props) {
    const audioManager = AudioManager.getInstance()

    const [currentCategory, setCategory] = useState<Category>(Object.keys(groups)[0] as Category)
    const [currentCharacter, setCharacter] = useState(DEFAULT_CHARACTER)
    const [currentFace, setFace] = useState(0)
    
    const characters = groups[currentCategory]
    return <div className="flex flex-col gap-8 w-4/5 justify-center items-center place-self-center select-none text-center" onDragStart={e=>e.preventDefault()}>
        <span className="text-3xl">Pick an icon</span>
        <div className="flex flex-col">
            <Image onClick={() => audioManager.getAudio("blip")?.play() || setFace((currentFace - 1) < 0 ? count[currentCharacter as keyof typeof count] - 1 : currentFace - 1)} className={`pixelated self-center translate-y-1/2 rotate-180 ${style["arrowHover"]}`} height={25} width={25} alt="" src={FaceArrowIcon} />
            <CharacterPreview onSelect={() => onSelect(currentCharacter, currentFace)} name={currentCharacter} face={currentFace} size={120} />
            <Image onClick={() => audioManager.getAudio("blip")?.play() || setFace((currentFace + 1) % count[currentCharacter as keyof typeof count])} className={`pixelated self-center -translate-y-1/2 ${style["arrowHover"]}`} height={25} width={25} alt="" src={FaceArrowIcon} />
        </div>
        <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-center items-center gap-3 flex-wrap">
                {Object.keys(groups).map((g, i) => <span onClick={() => audioManager.getAudio("select")?.play() || setCategory(g as Category)} style={{ "--category-color": COLORS[i % COLORS.length] } as CSSProperties} className={`bg-[--category-color] px-7 leading-4 text-black text-lg ${g === currentCategory ? "border-2 border-white" : ""}`} key={`category-${g}`}>{g}</span>)}
            </div>
            <div className="flex flex-row flex-wrap gap-3 justify-center">
                {characters.map(n => <CharacterPreview onSelect={() => {
                    setCharacter(n)
                    setFace(0)
                }} name={n} face={0} key={`character-${currentCategory}-${n}`} />)}
            </div>
        </div>
    </div>
}