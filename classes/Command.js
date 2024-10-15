"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }
    get name() {
        return this.data.name;
    }
}
exports.Command = Command;
