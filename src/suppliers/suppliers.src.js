// jshint esversion:9

"use strict";

class MyArray extends Array {

    constructor(...args) {
        super(...args);

        this.includes = this.includes.bind(this);
        this.indexOf = this.indexOf.bind(this);
        this.forEach = this.forEach.bind(this);
        this.entries = this.entries.bind(this);
        this.every = this.every.bind(this);
        this.filter = this.filter.bind(this);
        this.fill = this.fill.bind(this);
        this.find = this.find.bind(this);
        this.findIndex = this.findIndex.bind(this);
        this.flat = this.flat.bind(this);
        this.pop = this.pop.bind(this);
        this.push = this.push.bind(this);
        this.shift = this.shift.bind(this);
        this.values = this.values.bind(this);
        this.map = this.map.bind(this);


    }

    includes(searchElement) {
        return this.indexOf(searchElement) !== -1;
    }

    indexOf(searchElement) {
        for (let i = 0; i < this.length; i++) {
            if (this[i] === searchElement) {
                return i;
            }
        }
        return -1;
    }

    forEach(callbackfn, thisArg) {
        for (let i = 0; i < this.length; i++) {
            callbackfn.call(thisArg, this[i], i, this);
        }
    }

    entries() {
        return this.map((value, index) => [index, value]);
    }

    every(predicate, thisArg) {
        for (let i = 0; i < this.length; i++) {
            if (!predicate.call(thisArg, this[i], i, this)) {
                return false;
            }
        }
        return true;
    }

    filter(predicate, thisArg) {
        const filteredArray = [];
        for (let i = 0; i < this.length; i++) {
            if (predicate.call(thisArg, this[i], i, this)) {
                filteredArray.push(this[i]);
            }
        }
        return filteredArray;
    }

    fill(value, start, end) {
        for (let i = start; i < end; i++) {
            this[i] = value;
        }
        return this;
    }

    find(predicate, thisArg) {
        for (let i = 0; i < this.length; i++) {
            if (predicate.call(thisArg, this[i], i, this)) {
                return this[i];
            }
        }
        return undefined;
    }

    findIndex(predicate, thisArg) {
        for (let i = 0; i < this.length; i++) {
            if (predicate.call(thisArg, this[i], i, this)) {
                return i;
            }
        }
        return -1;
    }

    flat(depth) {
        if (depth === undefined) {
            return super.flat();
        } else {
            return super.flat(depth);
        }
    }

    values() {
        return this.map(value => value);
    }

    map(callbackfn, thisArg) {
        const mappedArray = [];
        for (let i = 0; i < this.length; i++) {
            mappedArray.push(callbackfn.call(thisArg, this[i], i, this));
        }
        return mappedArray;
    }

    push(...items) {
        for (let i = 0; i < items.length; i++) {
            super.push(items[i]);
        }
        return this.length;
    }

    pop() {
        return super.pop();
    }

    shift() {
        return super.shift();
    }

}

module.exports = {
    MyArray,


};
// Compare this snippet from data/drugs/drugs.data.js:
// // jshint esversion:9