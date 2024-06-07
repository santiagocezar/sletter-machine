class SlotMachine extends HTMLElement {
    slotsValues: string[][]
    slots: HTMLElement[]
    slotsInner: HTMLElement[]

    i: number = 0;

    constructor() {
        super()
        this.slotsValues = []
        this.slots = []
        this.slotsInner = []
    }

    connectedCallback() {
        const slots = this.getElementsByClassName("slot");

        for (const slot of slots) {
            if (!(slot instanceof HTMLElement)) throw new TypeError();
            this.slots.push(slot)

            const chars = [...slot.innerText];
            this.slotsValues.push(chars)

            const span = document.createElement("span")
            this.slotsInner.push(span)
            slot.innerHTML = ""
            slot.appendChild(span)
        }

        document.addEventListener("keypress", e => this.keyPressed(e))
    }

    keyPressed(e: KeyboardEvent) {
        if (e.code == "Space") {
            if (this.i == this.slots.length) {
                this.i = 0
                for (let i = 0; i < this.slots.length; i++) {
                    this.slots[i].removeAttribute("stop")
                    this.slotsInner[i].innerText = ""
                }
            } else {
                this.slots[this.i].setAttribute("stop", "")
                const bag = this.slotsValues[this.i];
                this.slotsInner[this.i].innerText = bag[Math.floor(Math.random() * bag.length)]
                this.i++
            }
        }
    }
}


customElements.define("slot-machine", SlotMachine);
