import miscStyles from "@/style/menu/misc.module.css"

import Link from "next/link"
import Soul from "#/img/soul.svg"
import Image from "next-export-optimize-images/image"

const SoulIcon = ({ className = "" }: { className?: string }) => <Image className={`inline mx-0.5 ${className}`.trim()} alt="Soul icon" src={Soul} />

const CREDITS = [
    ["DONTFORGET", "RickyG", "https://gamejolt.com/@RickyG"],
    ["UT/DR", "Toby Fox", "https://undertale.com"]
  ] as const
  
  export default function Footer() {
    return <footer className="bg-bg min-w-96 w-1/2 border-4 border-b-0 border-text p-5 self-center select-none mt-20" onDragStart={e => e.preventDefault()}>
      <div className="flex flex-row flex-wrap justify-center">
        {CREDITS.map(([name, creator, link], i) => <div key={`footer-credit-${i}`}>
          <Link title={`Visit ${creator}'s page!`} href={link}>{name} by {creator}</Link>
          {i+1 !== CREDITS.length && <span className="mx-3">*</span>}
        </div>)}
      </div>
      <span>Made with <SoulIcon className={miscStyles["rainbow"]} /> by <Link title="My page" href="https://meowpa.ws">kvba</Link></span>
    </footer>
  }