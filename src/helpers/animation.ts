export const animate = (el: Element, frames: Keyframe[], options?: number | KeyframeAnimationOptions) => new Promise(r => {
    el.animate(frames, options).addEventListener("finish", () => r(true), { once: true })
})