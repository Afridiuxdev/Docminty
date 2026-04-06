import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../data/services/razorpay_service.dart';

class BillingScreen extends ConsumerStatefulWidget {
  const BillingScreen({super.key});

  @override
  ConsumerState<BillingScreen> createState() => _BillingScreenState();
}

class _BillingScreenState extends ConsumerState<BillingScreen> {
  bool _annual = false;
  bool _purchasing = false;
  late RazorpayService _razorpay;

  @override
  void initState() {
    super.initState();
    _razorpay = ref.read(razorpayServiceProvider);
    _razorpay.init(
      onSuccess: _onPaymentSuccess,
      onFailure: _onPaymentFailure,
      onExternalWallet: _onExternalWallet,
    );
  }

  @override
  void dispose() {
    _razorpay.dispose();
    super.dispose();
  }

  Future<void> _startCheckout() async {
    final user = ref.read(currentUserProvider);
    if (user == null) return;
    setState(() => _purchasing = true);

    final monthlyPrice = 199;
    final annualPrice = (monthlyPrice * 12 * 0.83).round();
    final amountPaise = (_annual ? annualPrice : monthlyPrice) * 100;
    final planLabel = _annual ? 'ANNUAL' : 'MONTHLY';
    final description = 'Business Pro – $planLabel';

    try {
      final orderId = await _razorpay.createOrder(
        amountPaise: amountPaise,
        plan: planLabel,
      );
      _razorpay.openCheckout(
        orderId: orderId,
        amountPaise: amountPaise,
        userEmail: user.email,
        userName: user.name,
        description: description,
      );
    } catch (e) {
      if (mounted) {
        setState(() => _purchasing = false);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Could not initiate payment: ${e.toString()}'),
          backgroundColor: AppColors.error,
          behavior: SnackBarBehavior.floating,
        ));
      }
    }
  }

  Future<void> _onPaymentSuccess(PaymentSuccessResponse res) async {
    try {
      await _razorpay.verifyPayment(
        orderId: res.orderId ?? '',
        paymentId: res.paymentId ?? '',
        signature: res.signature ?? '',
      );
      await ref.read(authProvider.notifier).refreshUser();
      if (mounted) {
        setState(() => _purchasing = false);
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Payment successful! Welcome to Business Pro.'),
          backgroundColor: AppColors.success,
          behavior: SnackBarBehavior.floating,
        ));
      }
    } catch (_) {
      if (mounted) {
        setState(() => _purchasing = false);
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Payment received, but verification failed. Contact support.'),
          backgroundColor: AppColors.warning,
          behavior: SnackBarBehavior.floating,
        ));
      }
    }
  }

  void _onPaymentFailure(PaymentFailureResponse res) {
    if (mounted) {
      setState(() => _purchasing = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Payment failed: ${res.message ?? 'Unknown error'}'),
        backgroundColor: AppColors.error,
        behavior: SnackBarBehavior.floating,
      ));
    }
  }

  void _onExternalWallet(ExternalWalletResponse res) {
    if (mounted) setState(() => _purchasing = false);
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider);
    final isPro = user?.isPro == true;
    final monthlyPrice = 199;
    final annualPrice = (monthlyPrice * 12 * 0.83).round(); // 17% off
    final displayPrice = _annual ? '₹${(annualPrice / 12).round()}' : '₹$monthlyPrice';
    final displayPeriod = '/month';
    final billedNote = _annual ? 'Billed ₹$annualPrice/year' : 'Billed monthly';

    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('Billing'),
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded), onPressed: () => context.pop()),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [

          // ── Current Plan Card ───────────────────────────────────────────
          AppCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Row(children: [
              Container(
                width: 44, height: 44,
                decoration: BoxDecoration(
                  color: isPro ? AppColors.secondaryLight : AppColors.bgPage,
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.border),
                ),
                child: Icon(
                  isPro ? Icons.workspace_premium_rounded : Icons.shield_outlined,
                  color: isPro ? AppColors.secondary : AppColors.textMuted,
                  size: 22,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(isPro ? '${user!.plan.name.toUpperCase()} Plan' : 'Free Plan',
                    style: AppTextStyles.h4),
                Text(isPro ? 'You are on the Pro plan.' : 'You are on the free plan. Upgrade for more features.',
                    style: AppTextStyles.caption),
                if (isPro && user!.planExpiresAt != null) ...[
                  const SizedBox(height: 4),
                  Text('Expires: ${_fmtDate(user.planExpiresAt!)}',
                      style: AppTextStyles.caption.copyWith(color: AppColors.error)),
                ],
              ])),
            ]),
          ),
          const SizedBox(height: AppSpacing.lg),

          // ── Monthly / Annual Toggle ─────────────────────────────────────
          Center(
            child: Container(
              decoration: BoxDecoration(
                color: AppColors.bgCard,
                borderRadius: BorderRadius.circular(AppRadius.full),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                _ToggleBtn('Monthly', !_annual, () => setState(() => _annual = false)),
                _ToggleBtn('Annual (Save 17%)', _annual, () => setState(() => _annual = true)),
              ]),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // ── Free Plan ───────────────────────────────────────────────────
          _PlanCard(
            name: 'Free',
            price: '₹0',
            period: '/forever',
            isCurrent: !isPro,
            isHighlighted: false,
            features: const [
              _Feat('All 14 document types', true),
              _Feat('50 documents/month', true),
              _Feat('200 PDF downloads/month', true),
              _Feat('100 MB storage', true),
              _Feat('Logo upload', true),
              _Feat('GST auto-calculation', true),
              _Feat('Unlimited documents', false),
              _Feat('5 GB cloud storage', false),
              _Feat('Batch CSV processing', false),
              _Feat('Premium templates', false),
            ],
            buttonLabel: 'Current Plan',
            onTap: null,
          ),
          const SizedBox(height: AppSpacing.base),

          // ── Business Pro Plan ───────────────────────────────────────────
          _PlanCard(
            name: 'Business Pro',
            price: displayPrice,
            period: displayPeriod,
            billedNote: billedNote,
            isCurrent: isPro,
            isHighlighted: true,
            isRecommended: true,
            features: const [
              _Feat('Everything in Free', true),
              _Feat('Unlimited documents', true),
              _Feat('Unlimited PDF downloads', true),
              _Feat('5 GB cloud storage', true),
              _Feat('Batch CSV processing', true),
              _Feat('Premium templates', true),
              _Feat('No DocMinty footer', true),
              _Feat('Priority support', true),
              _Feat('API access (coming soon)', true),
            ],
            buttonLabel: isPro ? 'Current Plan' : (_purchasing ? 'Processing...' : 'Upgrade Now'),
            onTap: (isPro || _purchasing) ? null : _startCheckout,
          ),
          const SizedBox(height: AppSpacing.xl),

          // ── Payment History placeholder ─────────────────────────────────
          if (isPro) ...[
            Text('Payment History', style: AppTextStyles.h4),
            const SizedBox(height: AppSpacing.sm),
            AppCard(
              padding: const EdgeInsets.all(AppSpacing.xl),
              child: Center(child: Text('No payment history available.', style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted))),
            ),
          ],

          const SizedBox(height: 80),
        ],
      ),
    );
  }

  String _fmtDate(DateTime d) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return '${d.day} ${months[d.month - 1]} ${d.year}';
  }
}

class _ToggleBtn extends StatelessWidget {
  const _ToggleBtn(this.label, this.active, this.onTap);
  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: active ? AppColors.bgCard : Colors.transparent,
        borderRadius: BorderRadius.circular(AppRadius.full),
        border: active ? Border.all(color: AppColors.border) : null,
      ),
      child: Text(label, style: TextStyle(fontFamily: 'Inter', fontSize: 13, fontWeight: FontWeight.w600,
          color: active ? AppColors.textPrimary : AppColors.textMuted)),
    ),
  );
}

class _Feat {
  const _Feat(this.label, this.included);
  final String label;
  final bool included;
}

class _PlanCard extends StatelessWidget {
  const _PlanCard({
    required this.name, required this.price, required this.period,
    this.billedNote, required this.features,
    this.isCurrent = false, this.isHighlighted = false, this.isRecommended = false,
    required this.buttonLabel, required this.onTap,
  });
  final String name, price, period;
  final String? billedNote;
  final List<_Feat> features;
  final bool isCurrent, isHighlighted, isRecommended;
  final String buttonLabel;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Container(
          decoration: BoxDecoration(
            color: AppColors.bgCard,
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border: Border.all(color: isHighlighted ? AppColors.secondary : AppColors.border, width: isHighlighted ? 2 : 1),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            // Header
            Container(
              padding: const EdgeInsets.all(AppSpacing.base),
              decoration: BoxDecoration(
                color: isHighlighted ? AppColors.secondaryLight : AppColors.bgPage,
                borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.lg - 1)),
              ),
              child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(name, style: AppTextStyles.h4.copyWith(color: isHighlighted ? AppColors.secondary : AppColors.textPrimary)),
                  Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
                    Text(price, style: TextStyle(fontFamily: 'SpaceGrotesk', fontSize: 30, fontWeight: FontWeight.w800, color: isHighlighted ? AppColors.secondary : AppColors.textPrimary)),
                    Padding(padding: const EdgeInsets.only(bottom: 5, left: 2),
                        child: Text(period, style: AppTextStyles.caption)),
                  ]),
                  if (billedNote != null)
                    Text(billedNote!, style: AppTextStyles.caption.copyWith(color: AppColors.textMuted)),
                ]),
                if (isCurrent)
                  _Badge('Current Plan', AppColors.border, AppColors.textMuted)
                else if (isHighlighted)
                  _Badge('RECOMMENDED', AppColors.secondary, Colors.white),
              ]),
            ),
            // Features
            Padding(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(children: [
                ...features.map((f) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(children: [
                    Icon(f.included ? Icons.check_rounded : Icons.close_rounded,
                        size: 16, color: f.included ? AppColors.success : AppColors.textLight),
                    const SizedBox(width: 10),
                    Text(f.label, style: AppTextStyles.bodySm.copyWith(color: f.included ? AppColors.textPrimary : AppColors.textLight)),
                  ]),
                )),
                if (!isCurrent) ...[
                  const SizedBox(height: AppSpacing.base),
                  AppButton(
                    label: buttonLabel,
                    onPressed: onTap,
                    width: double.infinity,
                    variant: isHighlighted ? AppButtonVariant.primary : AppButtonVariant.outline,
                  ),
                ],
              ]),
            ),
          ]),
        ),
      ],
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge(this.label, this.bgColor, this.textColor);
  final String label;
  final Color bgColor;
  final Color textColor;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
    decoration: BoxDecoration(color: bgColor.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(AppRadius.full), border: Border.all(color: bgColor.withValues(alpha: 0.4))),
    child: Text(label, style: TextStyle(fontFamily: 'Inter', fontSize: 10, fontWeight: FontWeight.w700, color: bgColor == AppColors.secondary ? AppColors.secondary : textColor)),
  );
}
