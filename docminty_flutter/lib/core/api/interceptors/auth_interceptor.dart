import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../storage/storage_keys.dart';

/// Attaches JWT Bearer token to every request.
/// On 401, tries to refresh the token once, then retries.
/// On refresh failure, clears tokens (app will redirect to login via auth state).
class AuthInterceptor extends Interceptor {
  AuthInterceptor({required this.dio, required this.storage});

  final Dio dio;
  final FlutterSecureStorage storage;
  bool _isRefreshing = false;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await storage.read(key: StorageKeys.accessToken);
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401 && !_isRefreshing) {
      _isRefreshing = true;
      try {
        final refreshTk = await storage.read(key: StorageKeys.refreshToken);
        if (refreshTk == null) {
          await _clearTokens();
          _isRefreshing = false;
          handler.next(err);
          return;
        }

        // Call refresh endpoint directly to avoid interceptor loop
        final refreshDio = Dio(BaseOptions(baseUrl: dio.options.baseUrl));
        final res = await refreshDio.post(
          '/auth/refresh',
          data: {'refreshToken': refreshTk},
        );

        final newAccessToken = res.data['data']['accessToken'] as String;
        await storage.write(key: StorageKeys.accessToken, value: newAccessToken);

        // Retry original request with new token
        final opts = err.requestOptions;
        opts.headers['Authorization'] = 'Bearer $newAccessToken';
        final retryResponse = await dio.fetch(opts);
        _isRefreshing = false;
        handler.resolve(retryResponse);
      } catch (_) {
        await _clearTokens();
        _isRefreshing = false;
        handler.next(err);
      }
    } else {
      handler.next(err);
    }
  }

  Future<void> _clearTokens() async {
    await storage.delete(key: StorageKeys.accessToken);
    await storage.delete(key: StorageKeys.refreshToken);
  }
}
