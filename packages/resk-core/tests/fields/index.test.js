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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@fields/index");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Field Decorator', () => {
    (0, vitest_1.it)('should apply the Field decorator with a custom name', () => {
        class TestClass {
        }
        __decorate([
            (0, index_1.Field)({ name: "boris" }),
            __metadata("design:type", String)
        ], TestClass.prototype, "test", void 0);
        const instance = new TestClass();
        // Add assertions here to check if the decorator is applied correctly
        (0, vitest_1.expect)((0, index_1.getFields)(new TestClass())).toBe({ test: { name: "boris", type: "test" } });
    });
    (0, vitest_1.it)('should apply the Field decorator without options', () => {
        class TestClass {
        }
        __decorate([
            (0, index_1.Field)({}),
            __metadata("design:type", Number)
        ], TestClass.prototype, "anotherProperty", void 0);
        const instance = new TestClass();
        // Add assertions here to check if the decorator is applied correctly
        (0, vitest_1.expect)(Reflect.hasMetadata('field', instance, 'anotherProperty')).toBe(true);
    });
});
