import 'package:dio/dio.dart';

/// Unified exception model for the app.
/// All repository calls throw [AppException] so UI only handles one type.
class AppException implements Exception {
  const AppException({
    required this.message,
    this.code,
    this.statusCode,
  });

  final String message;
  final String? code;
  final int? statusCode;

  // ── Named constructors for common cases ───────────────────────────────────
  factory AppException.fromDio(DioException e) {
    final data = e.response?.data;
    final serverMsg = (data is Map) ? data['message'] as String? : null;

    return switch (e.type) {
      DioExceptionType.connectionTimeout ||
      DioExceptionType.receiveTimeout =>
        const AppException(
          message: 'Connection timed out. Please check your internet.',
          code: 'TIMEOUT',
        ),
      DioExceptionType.connectionError => const AppException(
          message: 'No internet connection.',
          code: 'NO_INTERNET',
        ),
      _ => AppException(
          message: serverMsg ?? _messageFromStatus(e.response?.statusCode),
          code: 'HTTP_${e.response?.statusCode}',
          statusCode: e.response?.statusCode,
        ),
    };
  }

  static String _messageFromStatus(int? status) => switch (status) {
        400 => 'Invalid request. Please check your input.',
        401 => 'Session expired. Please log in again.',
        403 => 'You do not have permission to do this.',
        404 => 'Resource not found.',
        409 => 'This already exists.',
        422 => 'Validation failed.',
        429 => 'Too many requests. Please wait.',
        500 => 'Server error. Please try again later.',
        _ => 'Something went wrong. Please try again.',
      };

  @override
  String toString() => message;
}
