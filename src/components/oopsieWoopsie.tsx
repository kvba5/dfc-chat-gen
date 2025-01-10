import type { MouseEvent } from "react"

import HarlowDefault from "#/img/halow_default.gif"

import Image from "next-export-optimize-images/image"
import { useEffect, useState } from "react"

export default function OopsieWoopsieComponent({ error }: { error?: string }) {
    const [errorRevealed, showError] = useState(false)

    // Copy code ref
    const copyError = (event: MouseEvent<HTMLTextAreaElement>) => {
        event.currentTarget.select()
        event.currentTarget.setSelectionRange(0, event.currentTarget.value.length)
        navigator.clipboard.writeText(event.currentTarget.value)
    }
    // Alerting about error
    useEffect(() => console.error(error), [error])
  
    return <div className="w-3/4 border-2 border-text p-10 m-10 flex flex-col gap-5 select-none items-center text-center place-self-center" onDragStart={e=>e.preventDefault()}>
      <Image className="border-2 border-text" alt="" src={HarlowDefault} />
      <div className="flex flex-col gap-3">
        <h1>oopsie Woopsie!!</h1>
        <span>This shouldn&apos;t be happening. Please report the bug to the creator of the website! -w-</span>
      </div>
      {error && <div className="flex flex-col w-full">
        <button onClick={() => showError(!errorRevealed)}>Click to {!errorRevealed ? "reveal" : "hide"} error...</button>
        {errorRevealed && <>
            <textarea onClick={copyError} readOnly className="bg-neutral-800 font-mono text-white text-left p-1 whitespace-pre-wrap break-all select-text">{error}</textarea>
            <span className="text-textsecond text-xs">Click to copy error</span>
        </>}
      </div>}
    </div>
  }