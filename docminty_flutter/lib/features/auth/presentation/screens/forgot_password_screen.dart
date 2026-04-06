import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../data/repositories/auth_repository.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});
  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  // Steps: 0=email, 1=otp, 2=new password, 3=success
  int _step = 0;
  bool _loading = false;
  String? _error;

  String _email = '';
  String _otp = '';
  final _emailCtrl = TextEditingController();
  final _otpCtrl = TextEditingController();
  final _newPassCtrl = TextEditingController();
  final _confirmPassCtrl = TextEditingController();
  bool _obscureNew = true;
  bool _obscureConfirm = true;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _otpCtrl.dispose();
    _newPassCtrl.dispose();
    _confirmPassCtrl.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    if (_emailCtrl.text.trim().isEmpty) {
      setState(() => _error = 'Please enter your email address.');
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      _email = _emailCtrl.text.trim();
      await ref.read(authRepositoryProvider).forgotPassword(_email);
      setState(() { _step = 1; _loading = false; });
    } catch (e) {
      setState(() { _error = e.toString().replaceAll('Exception: ', ''); _loading = false; });
    }
  }

  Future<void> _verifyOtp() async {
    _otp = _otpCtrl.text.trim();
    if (_otp.length != 6) {
      setState(() => _error = 'Please enter the 6-digit OTP.');
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      await ref.read(authRepositoryProvider).verifyResetOtp(email: _email, otp: _otp);
      setState(() { _step = 2; _loading = false; });
    } catch (e) {
      setState(() { _error = e.toString().replaceAll('Exception: ', ''); _loading = false; });
    }
  }

  Future<void> _resetPassword() async {
    final newPass = _newPassCtrl.text;
    final confirm = _confirmPassCtrl.text;
    if (newPass.length < 6) {
      setState(() => _error = 'Password must be at least 6 characters.');
      return;
    }
    if (newPass != confirm) {
      setState(() => _error = 'Passwords do not match.');
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      await ref.read(authRepositoryProvider).resetPassword(email: _email, newPassword: newPass);
      setState(() { _step = 3; _loading = false; });
    } catch (e) {
      setState(() { _error = e.toString().replaceAll('Exception: ', ''); _loading = false; });
    }
  }

  Future<void> _resendOtp() async {
    setState(() { _loading = true; _error = null; });
    try {
      await ref.read(authRepositoryProvider).forgotPassword(_email);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('OTP resent to your email.'),
          backgroundColor: AppColors.success,
          behavior: SnackBarBehavior.floating,
        ));
      }
    } catch (e) {
      setState(() => _error = e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('Forgot Password'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.base),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Step indicator
              _StepIndicator(current: _step),
              const SizedBox(height: AppSpacing.lg),

              if (_step == 0) _buildEmailStep(),
              if (_step == 1) _buildOtpStep(),
              if (_step == 2) _buildNewPasswordStep(),
              if (_step == 3) _buildSuccessStep(),

              if (_error != null && _step != 3) ...[
                const SizedBox(height: AppSpacing.base),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.errorLight,
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    border: Border.all(color: AppColors.error),
                  ),
                  child: Row(children: [
                    const Icon(Icons.error_outline_rounded, color: AppColors.error, size: 18),
                    const SizedBox(width: 8),
                    Expanded(child: Text(_error!, style: AppTextStyles.bodySm.copyWith(color: AppColors.error))),
                  ]),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmailStep() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Reset your password', style: AppTextStyles.h3),
      const SizedBox(height: 6),
      Text('Enter your registered email and we\'ll send you a reset OTP.',
          style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted)),
      const SizedBox(height: AppSpacing.lg),
      AppTextField(
        label: 'Email Address',
        hint: 'you@example.com',
        controller: _emailCtrl,
        keyboardType: TextInputType.emailAddress,
      ),
      const SizedBox(height: AppSpacing.base),
      AppButton(
        label: 'Send OTP',
        onPressed: _loading ? null : _sendOtp,
        loading: _loading,
        width: double.infinity,
      ),
    ],
  );

  Widget _buildOtpStep() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Enter OTP', style: AppTextStyles.h3),
      const SizedBox(height: 6),
      RichText(
        text: TextSpan(
          style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted),
          children: [
            const TextSpan(text: 'We\'ve sent a 6-digit OTP to '),
            TextSpan(text: _email,
                style: AppTextStyles.bodySm.copyWith(
                    color: AppColors.textPrimary, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
      const SizedBox(height: AppSpacing.lg),
      AppTextField(
        label: 'OTP Code',
        hint: '123456',
        controller: _otpCtrl,
        keyboardType: TextInputType.number,
        maxLines: 1,
      ),
      const SizedBox(height: AppSpacing.base),
      AppButton(
        label: 'Verify OTP',
        onPressed: _loading ? null : _verifyOtp,
        loading: _loading,
        width: double.infinity,
      ),
      const SizedBox(height: AppSpacing.base),
      Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        Text('Didn\'t receive it? ', style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted)),
        GestureDetector(
          onTap: _loading ? null : _resendOtp,
          child: Text('Resend OTP',
              style: AppTextStyles.bodySm.copyWith(
                  color: AppColors.secondary, fontWeight: FontWeight.w600)),
        ),
      ]),
      const SizedBox(height: AppSpacing.sm),
      GestureDetector(
        onTap: () => setState(() { _step = 0; _error = null; }),
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          const Icon(Icons.edit_rounded, size: 14, color: AppColors.textMuted),
          const SizedBox(width: 4),
          Text('Change email',
              style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted,
                  decoration: TextDecoration.underline)),
        ]),
      ),
    ],
  );

  Widget _buildNewPasswordStep() {
    final pass = _newPassCtrl.text;
    final strength = pass.isEmpty ? 0
        : pass.length >= 8 && pass.contains(RegExp(r'[0-9]')) && pass.contains(RegExp(r'[A-Z]')) ? 3
        : pass.length >= 6 ? 2
        : 1;
    final strengthLabel = ['', 'Weak', 'Fair', 'Strong'][strength];
    final strengthColor = [Colors.transparent, AppColors.error, Colors.orange, AppColors.success][strength];

    return StatefulBuilder(builder: (ctx, setSt) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('New Password', style: AppTextStyles.h3),
        const SizedBox(height: 6),
        Text('Choose a strong password for your account.',
            style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted)),
        const SizedBox(height: AppSpacing.lg),
        AppTextField(
          label: 'New Password',
          hint: '••••••••',
          controller: _newPassCtrl,
          obscureText: _obscureNew,
          onChanged: (_) => setSt(() {}),
          suffixIcon: IconButton(
            icon: Icon(_obscureNew ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                size: 20, color: AppColors.textMuted),
            onPressed: () => setSt(() => _obscureNew = !_obscureNew),
          ),
        ),
        if (pass.isNotEmpty) ...[
          const SizedBox(height: 6),
          Row(children: [
            Expanded(child: ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.full),
              child: LinearProgressIndicator(
                value: strength / 3,
                backgroundColor: AppColors.border,
                color: strengthColor,
                minHeight: 4,
              ),
            )),
            const SizedBox(width: 8),
            Text(strengthLabel, style: AppTextStyles.caption.copyWith(color: strengthColor)),
          ]),
        ],
        const SizedBox(height: AppSpacing.base),
        AppTextField(
          label: 'Confirm Password',
          hint: '••••••••',
          controller: _confirmPassCtrl,
          obscureText: _obscureConfirm,
          suffixIcon: IconButton(
            icon: Icon(_obscureConfirm ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                size: 20, color: AppColors.textMuted),
            onPressed: () => setSt(() => _obscureConfirm = !_obscureConfirm),
          ),
        ),
        const SizedBox(height: AppSpacing.base),
        AppButton(
          label: 'Reset Password',
          onPressed: _loading ? null : _resetPassword,
          loading: _loading,
          width: double.infinity,
        ),
      ],
    ));
  }

  Widget _buildSuccessStep() => Column(
    children: [
      const SizedBox(height: AppSpacing.xl),
      Container(
        width: 80, height: 80,
        decoration: BoxDecoration(
          color: AppColors.successLight,
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.check_rounded, color: AppColors.success, size: 40),
      ),
      const SizedBox(height: AppSpacing.lg),
      Text('Password Reset!', style: AppTextStyles.h3, textAlign: TextAlign.center),
      const SizedBox(height: 8),
      Text('Your password has been reset successfully.\nYou can now log in with your new password.',
          style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted),
          textAlign: TextAlign.center),
      const SizedBox(height: AppSpacing.xl),
      AppButton(
        label: 'Back to Login',
        onPressed: () => context.go('/login'),
        width: double.infinity,
      ),
    ],
  );
}

class _StepIndicator extends StatelessWidget {
  const _StepIndicator({required this.current});
  final int current;

  @override
  Widget build(BuildContext context) {
    if (current == 3) return const SizedBox.shrink();
    return Row(
      children: List.generate(3, (i) {
        final done = i < current;
        final active = i == current;
        return Expanded(
          child: Row(
            children: [
              Container(
                width: 28, height: 28,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: done || active ? AppColors.secondary : AppColors.border,
                ),
                child: Center(
                  child: done
                      ? const Icon(Icons.check_rounded, size: 14, color: Colors.white)
                      : Text('${i + 1}',
                          style: TextStyle(
                              fontSize: 12, fontFamily: 'Inter', fontWeight: FontWeight.w700,
                              color: active ? Colors.white : AppColors.textMuted)),
                ),
              ),
              if (i < 2)
                Expanded(child: Container(
                  height: 2,
                  color: i < current ? AppColors.secondary : AppColors.border,
                )),
            ],
          ),
        );
      }),
    );
  }
}
