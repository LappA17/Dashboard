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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const inversify_1 = require("inversify");
const base_controller_1 = require("../common/base.controller");
const http_error_class_1 = require("../errors/http-error.class");
const types_1 = require("../types");
require("reflect-metadata");
const user_login_dto_1 = require("./dto/user-login.dto");
const user_register_dto_1 = require("./dto/user-register.dto");
const validate_middleware_1 = require("../common/validate.middleware");
const jsonwebtoken_1 = require("jsonwebtoken");
let UserController = class UserController extends base_controller_1.BaseController {
    constructor(loggerService, userService, configService) {
        super(loggerService);
        this.loggerService = loggerService;
        this.userService = userService;
        this.configService = configService;
        this.bindRoutes([
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new validate_middleware_1.ValidateMiddleware(user_register_dto_1.UserRegisterDto)],
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new validate_middleware_1.ValidateMiddleware(user_login_dto_1.UserLoginDto)],
            },
            {
                path: '/info',
                method: 'get',
                func: this.info,
                middlewares: [],
            },
        ]);
    }
    login({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.validateUser(body);
            if (!result) {
                return next(new http_error_class_1.HTTPError(401, 'Error of authorization', 'login'));
            }
            const jwt = yield this.signJWT(body.email, this.configService.get('SECRET'));
            this.ok(res, { jwt });
        });
    }
    register({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.createUser(body);
            if (!result) {
                return next(new http_error_class_1.HTTPError(422, 'Такой пользователь уже существует'));
            }
            this.ok(res, { email: result.email, id: result.id });
        });
    }
    info({ user }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ok(res, { email: user });
        });
    }
    signJWT(email, secret) {
        return new Promise((resolve, reject) => {
            (0, jsonwebtoken_1.sign)({
                email,
                iat: Math.floor(Date.now() / 1000),
            }, secret, {
                algorithm: 'HS256',
            }, (err, token) => {
                if (err)
                    reject(err);
                resolve(token);
            });
        });
    }
};
UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UserService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=users.controller.js.map