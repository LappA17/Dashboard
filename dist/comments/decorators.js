"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
function Component(id) {
    console.log('init coponent');
    return (target) => {
        console.log('run coponent');
        target.prototype.id = id;
    };
}
function Logger() {
    console.log('init logger');
    return (target) => {
        console.log('run logger');
    };
}
function Method(target, propertyKey, propertyDescriptor) {
    console.log(propertyKey);
    const oldValue = propertyDescriptor.value;
    propertyDescriptor.value = function (...args) {
        return args[0] * 10;
    };
}
function Prop(target, propertyKey) {
    let value;
    const getter = () => {
        console.log('get');
        return value;
    };
    const setter = (newValue) => {
        console.log('set');
        value = newValue;
    };
    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
    });
}
function Param(target, propertyKey, index) {
    console.log(propertyKey, index);
}
let User = class User {
    updateId(newId) {
        this.id = newId;
        return this.id;
    }
};
__decorate([
    Prop,
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Method,
    __param(0, Param),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], User.prototype, "updateId", null);
User = __decorate([
    Logger(),
    Component(1)
], User);
console.log(new User().id);
console.log(new User().updateId(2));
//# sourceMappingURL=decorators.js.map