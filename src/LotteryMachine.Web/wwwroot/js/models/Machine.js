export class Machine {
    constructor(json) {
        json = json ?? {};

        this.name = json.name ?? "";
        this.key = json.key ?? guid();

        this.items = (json.items ?? []).map(x => new MachineItem(x));
    }

    get DigitCount() {
        let maxDigCount = 0;
        this.items.forEach(x => {
            let currentDigitalCount = getDigitalCount(x.rate);
            maxDigCount = maxDigCount > currentDigitalCount ? maxDigCount : currentDigitalCount;
        });
        return this.getRecommandDigitalCount(maxDigCount);
    }

    getRecommandDigitalCount(nowCount) {
        const defaultMax = 12;
        const defaultMin = 4;
        if (nowCount > defaultMax)
            return defaultMax;
        if (nowCount < defaultMin)
            return defaultMin;
        return nowCount;
    }

    autoSet() {
        let ave = +(1 / this.items.length);
        let currentDigitalCount = getDigitalCount(ave);
        let recommandCount = this.getRecommandDigitalCount(currentDigitalCount);
        this.items.forEach(x => {
            x.rate = +ave.toFixed(recommandCount)
        });
    }

    validate() {
        if (this.items.length === 0 || String.isStringNullOrEmpty(this.name))
            return false;
        return +this.items.reduce((a, b) => a + b.rate, 0).toFixed(this.DigitCount - 1) === 1
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

        let maxVal = Math.pow(10, this.DigitCount);
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
