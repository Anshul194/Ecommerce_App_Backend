import { Response } from "express";

class SuccessHandler {
  static sendSuccessResponse(
    res: Response,
    message: string,
    data?: any
  ): Response {
    let responseData: { success: boolean; message: string; data?: any } = {
      success: true,
      message: message,
    };
    if (data !== undefined) {
      responseData.data = data;
    }

    return res.status(200).json(responseData);
  }
}

export default SuccessHandler;
