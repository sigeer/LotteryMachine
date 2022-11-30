export class Machine {
    constructor(json) {
        json = json ?? {};

        this.name = json.name ?? "";
        this.key = json.key ?? guid();

        this.items = (json.items ?? []).map(x => new MachineItem(x));
    }

    validate() {
        return this.items.reduce((a, b) => a + b.rate, 0) === 1

    }

    run() {
        if (!this.validate())
            throw new Error();

        let maxDigCount = 0;
        this.items.forEach(x => {
            maxDigCount = getDigitalCount(x.rate);
        });
        let maxVal = Math.pow(10, maxDigCount);
        let random = getRandom(0, maxVal);
        let minRange = 0;
        let maxRange = 0;
        for(let item of this.items)
        {
            var step = (maxVal * item.rate);
            maxRange += step;
            if (random >= minRange && random < maxRange) {
                return item;
            }
            else {
                minRange += step;
            }
        }
        throw new Error();
    }
}

export class MachineItem {
    constructor(json) {
        json = json ?? {};

        this.name = json.name ?? ""
        this.rate = json.rate ?? 0;
        this.key = json.key ?? guid();
    }
}