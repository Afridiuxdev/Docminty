import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/presentation/providers/auth_provider.dart';
import '../features/auth/presentation/screens/login_screen.dart';
import '../features/auth/presentation/screens/signup_screen.dart';
import '../features/auth/presentation/screens/otp_screen.dart';
import '../features/auth/presentation/screens/forgot_password_screen.dart';
import '../features/create/presentation/screens/create_screen.dart';
import '../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../features/documents/data/models/document_model.dart';
import '../features/documents/presentation/screens/documents_screen.dart';
import '../features/invoice/presentation/screens/invoice_screen.dart';
import '../features/billing/presentation/screens/billing_screen.dart';
import '../features/notifications/presentation/screens/notifications_screen.dart';
import '../features/onboarding/presentation/screens/onboarding_screen.dart';
import '../features/pricing/presentation/screens/pricing_screen.dart';
import '../features/profile/presentation/screens/profile_screen.dart';
import '../features/settings/presentation/screens/settings_screen.dart';
import '../features/splash/presentation/screens/splash_screen.dart';
import '../features/tools/presentation/screens/tools_hub_screen.dart';
import '../features/tools/presentation/screens/qr_generator_screen.dart';
import '../features/tools/presentation/screens/jpg_to_pdf_screen.dart';
import '../features/tools/presentation/screens/pdf_to_jpg_screen.dart';
import '../features/tools/presentation/screens/merge_pdf_screen.dart';
import '../features/tools/presentation/screens/split_pdf_screen.dart';
import '../features/tools/presentation/screens/pdf_cloud_tool_screen.dart';
import '../features/tools/presentation/screens/calculators/emi_calculator_screen.dart';
import '../features/tools/presentation/screens/calculators/gst_calculator_screen.dart';
import '../features/tools/presentation/screens/calculators/salary_calculator_screen.dart';
import '../features/tools/presentation/screens/calculators/interest_calculator_screen.dart';
import '../features/tools/presentation/screens/calculators/loan_calculator_screen.dart';
import '../features/tools/presentation/screens/calculators/profit_margin_screen.dart';
import '../features/tools/presentation/screens/calculators/discount_calculator_screen.dart';
import '../features/quotation/presentation/screens/quotation_screen.dart';
import '../features/receipt/presentation/screens/receipt_screen.dart';
import '../features/salary_slip/presentation/screens/salary_slip_screen.dart';
import '../features/certificate/presentation/screens/certificate_screen.dart';
import '../features/experience_letter/presentation/screens/experience_letter_screen.dart';
import '../features/job_offer_letter/presentation/screens/job_offer_letter_screen.dart';
import '../features/resignation_letter/presentation/screens/resignation_letter_screen.dart';
import '../features/internship_certificate/presentation/screens/internship_certificate_screen.dart';
import '../features/purchase_order/presentation/screens/purchase_order_screen.dart';
import '../features/proforma_invoice/presentation/screens/proforma_invoice_screen.dart';
import '../features/payment_voucher/presentation/screens/payment_voucher_screen.dart';
import '../features/packing_slip/presentation/screens/packing_slip_screen.dart';
import '../features/rent_receipt/presentation/screens/rent_receipt_screen.dart';
import 'shell_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final authState = ref.read(authProvider);
      final isAuth = authState is AuthAuthenticated;
      final isLoading = authState is AuthLoading || authState is AuthInitial;
      final loc = state.matchedLocation;

      // Splash and onboarding handle their own navigation
      if (loc == '/splash' || loc == '/onboarding') return null;

      if (isLoading) return null;

      final publicRoutes = ['/login', '/signup', '/verify-otp', '/forgot-password'];
      if (!isAuth && !publicRoutes.contains(loc)) return '/login';
      if (isAuth && publicRoutes.contains(loc)) return '/dashboard';
      return null;
    },
    refreshListenable: GoRouterRefreshStream(
      ref.watch(authProvider.notifier).stream,
    ),
    routes: [
      // Splash & Onboarding
      GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingScreen()),

      // Auth routes
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/signup', builder: (_, __) => const SignupScreen()),
      GoRoute(
        path: '/verify-otp',
        builder: (_, state) => OtpScreen(email: state.extra as String),
      ),
      GoRoute(path: '/forgot-password', builder: (_, __) => const ForgotPasswordScreen()),

      // Main shell with bottom nav
      ShellRoute(
        builder: (_, __, child) => ShellScreen(child: child),
        routes: [
          GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
          GoRoute(path: '/documents', builder: (_, __) => const DocumentsScreen()),
          GoRoute(path: '/create', builder: (_, __) => const CreateScreen()),
          GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
        ],
      ),

      // Document generators
      GoRoute(
        path: '/invoice',
        builder: (_, state) => InvoiceScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/quotation',
        builder: (_, state) => QuotationScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/receipt',
        builder: (_, state) => ReceiptScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/salary-slip',
        builder: (_, state) => SalarySlipScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/certificate',
        builder: (_, state) => CertificateScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/experience-letter',
        builder: (_, state) => ExperienceLetterScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/job-offer-letter',
        builder: (_, state) => JobOfferLetterScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/resignation-letter',
        builder: (_, state) => ResignationLetterScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/internship-certificate',
        builder: (_, state) => InternshipCertificateScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/purchase-order',
        builder: (_, state) => PurchaseOrderScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/proforma-invoice',
        builder: (_, state) => ProformaInvoiceScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/payment-voucher',
        builder: (_, state) => PaymentVoucherScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/packing-slip',
        builder: (_, state) => PackingSlipScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/rent-receipt',
        builder: (_, state) => RentReceiptScreen(savedDocument: state.extra as DocumentModel?),
      ),
      GoRoute(
        path: '/pricing',
        builder: (_, __) => const PricingScreen(),
      ),
      GoRoute(
        path: '/billing',
        builder: (_, __) => const BillingScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (_, __) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/notifications',
        builder: (_, __) => const NotificationsScreen(),
      ),

      // ── Tools ──────────────────────────────────────────────────────────
      GoRoute(path: '/tools', builder: (_, __) => const ToolsHubScreen()),
      GoRoute(path: '/tools/qr-generator', builder: (_, __) => const QrGeneratorScreen()),
      GoRoute(path: '/tools/jpg-to-pdf', builder: (_, __) => const JpgToPdfScreen()),
      GoRoute(path: '/tools/pdf-to-jpg', builder: (_, __) => const PdfToJpgScreen()),
      GoRoute(path: '/tools/merge-pdf', builder: (_, __) => const MergePdfScreen()),
      GoRoute(path: '/tools/split-pdf', builder: (_, __) => const SplitPdfScreen()),
      GoRoute(
        path: '/tools/compress-pdf',
        builder: (_, __) => const PdfCloudToolScreen(
          title: 'Compress PDF',
          icon: Icons.compress_rounded,
          description: 'Reduce PDF file size while maintaining quality.',
          inputLabel: 'Tap to select PDF file',
          inputExtensions: ['pdf'],
          outputLabel: 'Compressed PDF',
        ),
      ),
      GoRoute(
        path: '/tools/pdf-to-word',
        builder: (_, __) => const PdfCloudToolScreen(
          title: 'PDF to Word',
          icon: Icons.description_rounded,
          description: 'Convert PDF documents to editable Word (.docx) files.',
          inputLabel: 'Tap to select PDF file',
          inputExtensions: ['pdf'],
          outputLabel: 'Word Document',
        ),
      ),
      GoRoute(
        path: '/tools/word-to-pdf',
        builder: (_, __) => const PdfCloudToolScreen(
          title: 'Word to PDF',
          icon: Icons.picture_as_pdf_rounded,
          description: 'Convert Word documents (.docx / .doc) to PDF.',
          inputLabel: 'Tap to select Word file',
          inputExtensions: ['docx', 'doc'],
          outputLabel: 'PDF',
        ),
      ),
      GoRoute(path: '/tools/emi-calculator', builder: (_, __) => const EmiCalculatorScreen()),
      GoRoute(path: '/tools/gst-calculator', builder: (_, __) => const GstCalculatorScreen()),
      GoRoute(path: '/tools/salary-calculator', builder: (_, __) => const SalaryCalculatorScreen()),
      GoRoute(path: '/tools/interest-calculator', builder: (_, __) => const InterestCalculatorScreen()),
      GoRoute(path: '/tools/loan-calculator', builder: (_, __) => const LoanCalculatorScreen()),
      GoRoute(path: '/tools/profit-margin', builder: (_, __) => const ProfitMarginScreen()),
      GoRoute(path: '/tools/discount-calculator', builder: (_, __) => const DiscountCalculatorScreen()),
    ],
  );
});

class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<dynamic> stream) {
    notifyListeners();
    _sub = stream.listen((_) => notifyListeners());
  }
  late final dynamic _sub;
  @override
  void dispose() {
    _sub.cancel();
    super.dispose();
  }
}
