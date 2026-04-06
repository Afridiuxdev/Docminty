class ApiConstants {
  ApiConstants._();

  // Change to production URL before release
  static const String baseUrl = 'http://10.0.2.2:8080/api';
  // Android emulator: 10.0.2.2 = host localhost
  // iOS simulator: 127.0.0.1
  // Physical device: your machine's LAN IP e.g. 192.168.1.x

  // Auth
  static const String signup = '/auth/signup';
  static const String login = '/auth/login';
  static const String loginGoogle = '/auth/google';
  static const String verifyOtp = '/auth/verify-otp';
  static const String resendOtp = '/auth/resend-otp';
  static const String refreshToken = '/auth/refresh';
  static const String me = '/auth/me';
  static const String forgotPassword = '/auth/forgot-password';
  static const String verifyResetOtp = '/auth/verify-reset-otp';
  static const String resetPassword = '/auth/reset-password';
  static const String updateProfile = '/auth/me';
  static const String uploadAvatar = '/auth/me/avatar';
  static const String notifications = '/notifications';

  // Documents
  static const String documents = '/documents';
  static String deleteDocument(int id) => '/documents/$id';

  // Payments
  static const String createOrder = '/payment/create-order';
  static const String verifyPayment = '/payment/verify';

  // Certificate verification
  static const String saveCertificate = '/verify';
  static String verifyCertificate(String id) => '/verify/$id';

  // Public
  static const String contact = '/public/contact';
  static String publicVerify(String id) => '/public/verify/$id';
}
