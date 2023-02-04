"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthMiddleware {
    constructor(secret) {
        this.secret = secret;
    }
    execute({ headers, user }, res, next) {
        const headersAuth = headers.authorization;
        if (headersAuth) {
            const token = headersAuth.split(' ')[1];
            (0, jsonwebtoken_1.verify)(token, this.secret, (err, payload) => {
                if (err)
                    next();
                else if (payload) {
                    console.log(payload);
                    next();
                }
            });
        }
        next();
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map