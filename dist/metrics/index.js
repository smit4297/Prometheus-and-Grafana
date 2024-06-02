"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMiddleware = exports.cleanupMiddleware = void 0;
const requestCount_1 = require("./requestCount");
const activeRequests_1 = require("./activeRequests");
//below code is only for counter
// export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     // const startTime = Date.now();
//     res.on('finish', function() {
//         // const endTime = Date.now();
//         // console.log(`Request took ${endTime - startTime}ms`);
//         // Increment request counter
//         requestCounter.inc({
//             method: req.method,
//             route: req.route ? req.route.path : req.path,
//             status_code: res.statusCode
//         });
//     });
//     next();
// }
// below code can do counter + gauge
const cleanupMiddleware = (req, res, next) => {
    // const startTime = Date.now();
    activeRequests_1.activeRequestsGauge.inc();
    res.on('finish', function () {
        // const endTime = Date.now();
        // console.log(`Request took ${endTime - startTime}ms`);
        requestCount_1.requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });
        activeRequests_1.activeRequestsGauge.dec();
    });
    next();
};
exports.cleanupMiddleware = cleanupMiddleware;
// below code can do counter + gauge + histogram
const metricsMiddleware = (req, res, next) => {
    const startTime = Date.now();
    activeRequests_1.activeRequestsGauge.inc();
    res.on('finish', function () {
        const endTime = Date.now();
        const duration = endTime - startTime;
        // Increment request counter
        requestCount_1.requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });
        requestCount_1.httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, duration);
        activeRequests_1.activeRequestsGauge.dec();
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
