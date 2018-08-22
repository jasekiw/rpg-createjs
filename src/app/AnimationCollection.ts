export interface AnimationCollection {
    walk: Animation,
    attack: Animation,
    yawn?: Animation,
    death?: Animation
}

export interface Animation {
    length: number,
    up: number,
    down: number,
    left: number,
    right: number
}
