export class Machine {
    constructor(json) {
        json = json ?? {};

        this.name = json.name ?? "";
        this.key = json.key ?? guid();

        this.items = (json.items ?? []).map(x => new MachineItem(x));
    }

    get MaxDigitCount() {
        const defaultMax = 12;
        let maxDigCount = 0;
        this.items.forEach(x => {
            let currentDigitalCount = getDigitalCount(x.rate);
            maxDigCount = maxDigCount > currentDigitalCount ? maxDigCount : currentDigitalCount;
        });
        return maxDigCount > defaultMax ? defaultMax : maxDigCount;
    }

    validate() {
        if (this.items.length === 0)
            return false;
        return +this.items.reduce((a, b) => a + b.rate, 0).toFixed(this.MaxDigitCount) === 1
    }

    addItem() {
        this.items.push(new MachineItem());
    }

    removeItem(item) {
        this.items = this.items.filter(x => x.key !== item.key);
    }

    run() {
        if (!this.validate())
            throw new Error();

        let maxVal = Math.pow(10, this.MaxDigitCount);
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

    equal(model) {
        if (!model)
            return false;

        if (model.name === this.name && model.items.length == this.items.length) {
            for (var i = 0; i < this.items.length; i++) {
                if (!model.items.contains(x => x.name === this.items[i].name && x.rate === this.items[i].rate))
                    return false;
            }
            return true;
        }
        return false;
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
