"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SuccessHandler {
    static sendSuccessResponse(res, message, data) {
        let responseData = {
            success: true,
            message: message
        };
        if (data !== undefined) {
            responseData.data = data;
        }
        return res.status(200).json(responseData);
    }
}
exports.default = SuccessHandler;
