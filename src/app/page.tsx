"use client"

import type { JSX } from "react";

import style from "@/style/menu.module.css"

import HarlowSoul from "#/img/spr_har_soul_0.png"

import Intro from "@/components/intro";
import { useState } from "react";
import Footer from "@/components/menu/footer";
import Header from "@/components/menu/header";
import OopsieWoopsieComponent from "@/components/oopsieWoopsie";
import UndertaleKeypad, { LOWERCASE_LETTERS, SPECIAL_CHARACTERS, UPPERCASE_LETTERS } from "@/components/menu/keypad";
import CharacterPicker, { DEFAULT_CHARACTER } from "@/components/menu/characterPicker";
import PreviewComponent from "@/components/menu/preview";
import Image from "next-export-optimize-images/image";


enum MenuStages {
  NAME_PICKER,
  MESSAGE_WRITER,
  CHARACTER_PICKER,
  PREVIEW
}

function Menu() {
  const [currentStage, setMenuStage] = useState<MenuStages>(MenuStages.NAME_PICKER)

   
  const [playerName, setPlayerName] = useState("???")
  const [message, setMessage] = useState("If you see this message - I broke something lol")
  const [character, setCharacter] = useState(DEFAULT_CHARACTER)
  const [face, setFace] = useState(0)

  let stageElement: () => JSX.Element;
  switch(currentStage) {
      case MenuStages.NAME_PICKER:
        stageElement = () => <UndertaleKeypad
          title="Name fallen player"
          characterLimit={16}
          onDone={(name) => {
            setPlayerName(name)
            setMenuStage(MenuStages.MESSAGE_WRITER)
          }}
          />
        break;

      case MenuStages.MESSAGE_WRITER:
        stageElement = () => <UndertaleKeypad
          title="Enter the message"
          characters={[UPPERCASE_LETTERS, LOWERCASE_LETTERS, `${SPECIAL_CHARACTERS}?!@$%^&*():;"'{}[]|<>/+= .,`]}
          onDone={(msg) => {
            setMessage(msg)
            setMenuStage(MenuStages.CHARACTER_PICKER)
          }}
          onBack={() => setMenuStage(MenuStages.NAME_PICKER)}
          />
        break;

      case MenuStages.CHARACTER_PICKER:
        stageElement = () => <CharacterPicker onSelect={(character, face) => {
          setCharacter(character)
          setFace(face)
          setMenuStage(MenuStages.PREVIEW)
        }} />
        break;

      case MenuStages.PREVIEW:
        stageElement = () => <PreviewComponent {...{ playerName, message, character, face }} />
        break;

      default:
        stageElement = () => <OopsieWoopsieComponent error={`Menu Stage with ID #${currentStage} doesn't exist...`} />
  }


  return <div className="text-center flex flex-col h-full">
    <Header />
    <Image src={HarlowSoul} alt="" height={300} className={`${style["harsoul"]} pixelated absolute right-24 max-[900px]:hidden`} />
    <div className="flex-grow">
      {stageElement()}
    </div>
    <Footer />
  </div>
}

export default function Page() {
  const [shouldShowIntro, enableIntro] = useState(true)
  return shouldShowIntro ? <Intro enableIntro={enableIntro} /> : <Menu />
}
