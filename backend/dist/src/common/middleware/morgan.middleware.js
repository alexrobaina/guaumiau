"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MorganMiddleware = void 0;
const common_1 = require("@nestjs/common");
const morgan_1 = __importDefault(require("morgan"));
let MorganMiddleware = class MorganMiddleware {
    logger = new common_1.Logger('HTTP');
    use(req, res, next) {
        morgan_1.default.token('body', (req) => {
            const body = { ...req.body };
            if (body.password)
                body.password = '***';
            if (body.refreshToken)
                body.refreshToken = '***';
            return JSON.stringify(body);
        });
        morgan_1.default.token('user', (req) => {
            return req.user?.id || 'anonymous';
        });
        const devFormat = ':method :url :status :response-time ms - :res[content-length] - User: :user';
        const prodFormat = ':remote-addr - :user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';
        const format = process.env.NODE_ENV === 'production' ? prodFormat : devFormat;
        const morganMiddleware = (0, morgan_1.default)(format, {
            stream: {
                write: (message) => {
                    this.logger.log(message.trim());
                },
            },
            skip: (req) => {
                return req.url === '/health' || req.url === '/';
            },
        });
        return morganMiddleware(req, res, next);
    }
};
exports.MorganMiddleware = MorganMiddleware;
exports.MorganMiddleware = MorganMiddleware = __decorate([
    (0, common_1.Injectable)()
], MorganMiddleware);
//# sourceMappingURL=morgan.middleware.js.map