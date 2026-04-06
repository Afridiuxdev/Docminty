import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';

class PricingScreen extends StatelessWidget {
  const PricingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('Upgrade to Pro'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          children: [
            // ── Hero ──────────────────────────────────────────────────────
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.xl),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primary, AppColors.secondary],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppRadius.xl),
              ),
              child: const Column(
                children: [
                  Icon(Icons.workspace_premium_rounded,
                      color: Colors.amber, size: 48),
                  SizedBox(height: 12),
                  Text(
                    'DocMinty Pro',
                    style: TextStyle(
                      fontFamily: 'SpaceGrotesk',
                      fontSize: 26,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 6),
                  Text(
                    'Everything you need for professional documents',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 13,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // ── Plans ─────────────────────────────────────────────────────
            _PlanCard(
              name: 'Free',
              price: '₹0',
              period: 'forever',
              isCurrent: true,
              features: const [
                _Feature('Up to 5 documents/month', true),
                _Feature('Basic templates', true),
                _Feature('PDF download', true),
                _Feature('Cloud storage', false),
                _Feature('Logo upload', false),
                _Feature('Premium templates', false),
                _Feature('Priority support', false),
              ],
              onTap: null,
            ),
            const SizedBox(height: AppSpacing.base),
            _PlanCard(
              name: 'Pro',
              price: '₹199',
              period: '/month',
              isHighlighted: true,
              features: const [
                _Feature('Unlimited documents', true),
                _Feature('All premium templates', true),
                _Feature('PDF download', true),
                _Feature('Cloud storage', true),
                _Feature('Logo upload', true),
                _Feature('Custom branding', true),
                _Feature('Priority support', true),
              ],
              onTap: () => _showPaymentDialog(context),
            ),
            const SizedBox(height: AppSpacing.base),
            _PlanCard(
              name: 'Enterprise',
              price: '₹999',
              period: '/month',
              features: const [
                _Feature('Everything in Pro', true),
                _Feature('Team accounts (5 users)', true),
                _Feature('API access', true),
                _Feature('Bulk generation', true),
                _Feature('White-label PDFs', true),
                _Feature('Dedicated support', true),
                _Feature('Custom integrations', true),
              ],
              onTap: () => _showPaymentDialog(context),
            ),
            const SizedBox(height: AppSpacing.xl),

            // ── Trust signals ─────────────────────────────────────────────
            AppCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _Trust(icon: Icons.lock_rounded, label: 'Secure\nPayments'),
                  _Trust(icon: Icons.cancel_rounded, label: 'Cancel\nAnytime'),
                  _Trust(icon: Icons.support_agent_rounded,
                      label: '24/7\nSupport'),
                ],
              ),
            ),
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }

  void _showPaymentDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Coming Soon'),
        content: const Text(
          'In-app payments will be available shortly.\n\nVisit docminty.com to upgrade your plan.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}

class _PlanCard extends StatelessWidget {
  const _PlanCard({
    required this.name,
    required this.price,
    required this.period,
    required this.features,
    this.isCurrent = false,
    this.isHighlighted = false,
    this.onTap,
  });

  final String name;
  final String price;
  final String period;
  final List<_Feature> features;
  final bool isCurrent;
  final bool isHighlighted;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(
          color: isHighlighted ? AppColors.secondary : AppColors.border,
          width: isHighlighted ? 2 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: isHighlighted
                  ? AppColors.secondaryLight
                  : AppColors.bgPage,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(AppRadius.lg - 1),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: AppTextStyles.h4.copyWith(
                        color: isHighlighted
                            ? AppColors.secondary
                            : AppColors.textPrimary,
                      ),
                    ),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          price,
                          style: TextStyle(
                            fontFamily: 'SpaceGrotesk',
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            color: isHighlighted
                                ? AppColors.secondary
                                : AppColors.textPrimary,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(bottom: 4, left: 2),
                          child: Text(period,
                              style: AppTextStyles.caption),
                        ),
                      ],
                    ),
                  ],
                ),
                if (isCurrent)
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.bgCard,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: const Text('Current',
                        style: TextStyle(
                          fontSize: 11,
                          fontFamily: 'Inter',
                          fontWeight: FontWeight.w600,
                          color: AppColors.textMuted,
                        )),
                  )
                else if (isHighlighted)
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                    child: const Text('Popular',
                        style: TextStyle(
                          fontSize: 11,
                          fontFamily: 'Inter',
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        )),
                  ),
              ],
            ),
          ),

          // Features
          Padding(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(
              children: [
                ...features.map((f) => _FeatureRow(feature: f)),
                if (onTap != null) ...[
                  const SizedBox(height: AppSpacing.base),
                  AppButton(
                    label: 'Get $name',
                    onPressed: onTap,
                    width: double.infinity,
                    variant: isHighlighted
                        ? AppButtonVariant.primary
                        : AppButtonVariant.outline,
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FeatureRow extends StatelessWidget {
  const _FeatureRow({required this.feature});
  final _Feature feature;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            feature.included
                ? Icons.check_circle_rounded
                : Icons.cancel_rounded,
            size: 16,
            color: feature.included
                ? AppColors.success
                : AppColors.textLight,
          ),
          const SizedBox(width: 10),
          Text(
            feature.label,
            style: AppTextStyles.bodySm.copyWith(
              color: feature.included
                  ? AppColors.textPrimary
                  : AppColors.textLight,
            ),
          ),
        ],
      ),
    );
  }
}

class _Feature {
  const _Feature(this.label, this.included);
  final String label;
  final bool included;
}

class _Trust extends StatelessWidget {
  const _Trust({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) => Column(
        children: [
          Icon(icon, color: AppColors.secondary, size: 24),
          const SizedBox(height: 4),
          Text(
            label,
            textAlign: TextAlign.center,
            style: AppTextStyles.caption,
          ),
        ],
      );
}
