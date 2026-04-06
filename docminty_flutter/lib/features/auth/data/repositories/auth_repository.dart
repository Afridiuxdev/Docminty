import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_constants.dart';
import '../../../../core/errors/app_exception.dart';
import '../../../../core/storage/secure_storage.dart';
import '../../../../core/storage/storage_keys.dart';
import '../models/user_model.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    dio: ref.read(dioProvider),
    storage: ref.read(secureStorageProvider),
  );
});

class AuthRepository {
  AuthRepository({required this.dio, required this.storage});

  final Dio dio;
  final dynamic storage; // FlutterSecureStorage

  // ── Signup ────────────────────────────────────────────────────────────────
  Future<void> signup({
    required String name,
    required String email,
    required String password,
    required String phone,
  }) async {
    try {
      await dio.post(ApiConstants.signup, data: {
        'name': name,
        'email': email,
        'password': password,
        'phone': phone,
      });
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  // ── Verify OTP ────────────────────────────────────────────────────────────
  Future<void> verifyOtp({
    required String email,
    required String otp,
  }) async {
    try {
      await dio.post(ApiConstants.verifyOtp, data: {
        'email': email,
        'otp': otp,
      });
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────────────────
  Future<void> resendOtp(String email) async {
    try {
      await dio.post(ApiConstants.resendOtp, data: {'email': email});
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    try {
      final res = await dio.post(ApiConstants.login, data: {
        'email': email,
        'password': password,
      });
      return _handleAuthResponse(res.data);
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  // ── Google Login ──────────────────────────────────────────────────────────
  Future<UserModel> loginWithGoogle(String idToken) async {
    try {
      final res = await dio.post(ApiConstants.loginGoogle, data: {
        'idToken': idToken,
      });
      return _handleAuthResponse(res.data);
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  // ── Get Current User ──────────────────────────────────────────────────────
  Future<UserModel> getMe() async {
    try {
      final res = await dio.get(ApiConstants.me);
      final data = res.data['data'] ?? res.data;
      return UserModel.fromJson(data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  // ── Forgot Password ───────────────────────────────────────────────────────
  Future<void> forgotPassword(String email) async {
    try {
      await dio.post(ApiConstants.forgotPassword, data: {'email': email});
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  // ── Verify Reset OTP ──────────────────────────────────────────────────────
  Future<void> verifyResetOtp({
    required String email,
    required String otp,
  }) async {
    try {
      await dio.post(ApiConstants.verifyResetOtp, data: {
        'email': email,
        'otp': otp,
      });
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  // ── Reset Password ────────────────────────────────────────────────────────
  Future<void> resetPassword({
    required String email,
    required String newPassword,
  }) async {
    try {
      await dio.post(ApiConstants.resetPassword, data: {
        'email': email,
        'newPassword': newPassword,
      });
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  // ── Update Profile ────────────────────────────────────────────────────────
  Future<UserModel> updateProfile(Map<String, dynamic> data) async {
    try {
      final res = await dio.put(ApiConstants.updateProfile, data: data);
      final body = res.data['data'] ?? res.data;
      return UserModel.fromJson(body as Map<String, dynamic>);
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  // ── Upload Avatar ─────────────────────────────────────────────────────────
  Future<UserModel> uploadAvatar(File imageFile) async {
    try {
      final formData = FormData.fromMap({
        'avatar': await MultipartFile.fromFile(
          imageFile.path,
          filename: 'avatar.jpg',
        ),
      });
      final res = await dio.post(ApiConstants.uploadAvatar, data: formData);
      final body = res.data['data'] ?? res.data;
      final user = UserModel.fromJson(body as Map<String, dynamic>);
      await storage.write(key: StorageKeys.userJson, value: user.toJsonString());
      return user;
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  // ── Logout (local only) ───────────────────────────────────────────────────
  Future<void> logout() async {
    await storage.delete(key: StorageKeys.accessToken);
    await storage.delete(key: StorageKeys.refreshToken);
    await storage.delete(key: StorageKeys.userJson);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  Future<UserModel> _handleAuthResponse(dynamic responseData) async {
    final data = responseData['data'] ?? responseData;
    final accessToken = data['accessToken'] as String;
    final refreshToken = data['refreshToken'] as String;
    final userJson = data['user'] as Map<String, dynamic>;

    await storage.write(key: StorageKeys.accessToken, value: accessToken);
    await storage.write(key: StorageKeys.refreshToken, value: refreshToken);

    final user = UserModel.fromJson(userJson);
    await storage.write(key: StorageKeys.userJson, value: user.toJsonString());
    return user;
  }

  Future<bool> hasValidToken() async {
    final token = await storage.read(key: StorageKeys.accessToken);
    return token != null && token.isNotEmpty;
  }

  Future<UserModel?> getCachedUser() async {
    final s = await storage.read(key: StorageKeys.userJson);
    if (s == null) return null;
    try {
      return UserModel.fromJsonString(s);
    } catch (_) {
      return null;
    }
  }
}
