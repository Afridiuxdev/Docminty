import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_constants.dart';
import '../../../../core/errors/app_exception.dart';

class RazorpayService {
  RazorpayService({required this.dio});

  final Dio dio;
  late Razorpay _razorpay;

  // Replace with your actual Razorpay key from dashboard.razorpay.com
  static const _razorpayKey = 'rzp_test_SXmrLtIavlbCri';

  void init({
    required void Function(PaymentSuccessResponse) onSuccess,
    required void Function(PaymentFailureResponse) onFailure,
    required void Function(ExternalWalletResponse) onExternalWallet,
  }) {
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, onSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, onFailure);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, onExternalWallet);
  }

  /// Creates a Razorpay order on the backend and returns the orderId.
  Future<String> createOrder({
    required int amountPaise,
    required String plan,
  }) async {
    try {
      final res = await dio.post(ApiConstants.createOrder, data: {
        'amount': amountPaise,
        'plan': plan,
      });
      final data = res.data['data'] ?? res.data;
      return data['orderId'] as String;
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  /// Opens Razorpay checkout with pre-filled user details.
  void openCheckout({
    required String orderId,
    required int amountPaise,
    required String userEmail,
    required String userName,
    required String description,
  }) {
    _razorpay.open({
      'key': _razorpayKey,
      'amount': amountPaise,
      'order_id': orderId,
      'name': 'DocMinty',
      'description': description,
      'prefill': {
        'email': userEmail,
        'name': userName,
      },
      'theme': {'color': '#0D9488'},
      'modal': {'confirm_close': true},
    });
  }

  /// Verifies the payment signature with the backend.
  Future<void> verifyPayment({
    required String orderId,
    required String paymentId,
    required String signature,
  }) async {
    try {
      await dio.post(ApiConstants.verifyPayment, data: {
        'orderId': orderId,
        'paymentId': paymentId,
        'signature': signature,
      });
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  void dispose() => _razorpay.clear();
}

final razorpayServiceProvider = Provider<RazorpayService>((ref) {
  return RazorpayService(dio: ref.read(dioProvider));
});
