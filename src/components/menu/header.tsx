import Link from "next/link";

export default function Header() {
  return <header className="my-12 flex flex-col items-center select-none" onDragStart={e=>e.preventDefault()}>
    <div>
      <h1 className="inline"><Link role="custom-link" href="#" onClick={() => location.reload()}><span className="before:bg-[#c31ac3] before:absolute before:w-4 before:h-4 before:translate-x-2 before:translate-y-2 before:-z-20 before:content-[ ]">D</span>F Chat Generator</Link></h1>
      <span className="ml-2">v2</span>
    </div>
    <span className="text-xl">Generate any DF-like message you like!</span>
  </header>
}