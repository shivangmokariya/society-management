class ApiResponse {
  static success(res, message = 'Operation successful', data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, message = 'Resource created successfully', data = null) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }
}

module.exports = ApiResponse;
