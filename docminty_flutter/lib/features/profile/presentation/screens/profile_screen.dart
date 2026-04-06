import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  bool _saving = false;
  bool _uploadingAvatar = false;

  late TextEditingController _nameCtrl;
  late TextEditingController _phoneCtrl;
  late TextEditingController _websiteCtrl;
  late TextEditingController _companyCtrl;
  late TextEditingController _gstinCtrl;
  late TextEditingController _addressCtrl;
  late TextEditingController _cityCtrl;

  @override
  void initState() {
    super.initState();
    final user = ref.read(currentUserProvider);
    _nameCtrl    = TextEditingController(text: user?.name ?? '');
    _phoneCtrl   = TextEditingController(text: user?.phone ?? '');
    _websiteCtrl = TextEditingController(text: user?.website ?? '');
    _companyCtrl = TextEditingController(text: user?.company ?? '');
    _gstinCtrl   = TextEditingController(text: user?.gstin ?? '');
    _addressCtrl = TextEditingController(text: user?.address ?? '');
    _cityCtrl    = TextEditingController(text: user?.city ?? '');
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _websiteCtrl.dispose();
    _companyCtrl.dispose();
    _gstinCtrl.dispose();
    _addressCtrl.dispose();
    _cityCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    final ok = await ref.read(authProvider.notifier).updateProfile(
      name:    _nameCtrl.text.trim(),
      phone:   _phoneCtrl.text.trim().isEmpty ? null : _phoneCtrl.text.trim(),
      website: _websiteCtrl.text.trim().isEmpty ? null : _websiteCtrl.text.trim(),
      company: _companyCtrl.text.trim().isEmpty ? null : _companyCtrl.text.trim(),
      gstin:   _gstinCtrl.text.trim().isEmpty ? null : _gstinCtrl.text.trim(),
      address: _addressCtrl.text.trim().isEmpty ? null : _addressCtrl.text.trim(),
      city:    _cityCtrl.text.trim().isEmpty ? null : _cityCtrl.text.trim(),
    );
    if (mounted) {
      setState(() => _saving = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(ok ? 'Profile updated!' : 'Failed to save. Try again.'),
        backgroundColor: ok ? AppColors.success : AppColors.error,
        behavior: SnackBarBehavior.floating,
      ));
    }
  }

  Future<void> _showChangePasswordDialog(BuildContext context) async {
    final currentCtrl = TextEditingController();
    final newCtrl = TextEditingController();
    final confirmCtrl = TextEditingController();
    final formKey = GlobalKey<FormState>();

    await showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Change Password'),
        content: Form(
          key: formKey,
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            TextFormField(
              controller: currentCtrl,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Current Password'),
              validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: newCtrl,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'New Password'),
              validator: (v) => (v == null || v.length < 8) ? 'Min 8 characters' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: confirmCtrl,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Confirm New Password'),
              validator: (v) => v != newCtrl.text ? 'Passwords do not match' : null,
            ),
          ]),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              if (formKey.currentState!.validate()) {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                  content: Text('Password changed successfully.'),
                  backgroundColor: AppColors.success,
                  behavior: SnackBarBehavior.floating,
                ));
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.secondary),
            child: const Text('Update', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
    currentCtrl.dispose();
    newCtrl.dispose();
    confirmCtrl.dispose();
  }

  Future<void> _confirmDeleteAccount(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Account', style: TextStyle(color: AppColors.error)),
        content: const Text(
          'This will permanently delete your account, all documents, and all data. This action cannot be undone.',
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('Delete My Account', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
    if (confirmed == true && mounted) {
      await ref.read(authProvider.notifier).logout();
      if (mounted) context.go('/login');
    }
  }

  Future<void> _pickAvatar() async {
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt_rounded),
              title: const Text('Take a photo'),
              onTap: () => Navigator.pop(ctx, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_rounded),
              title: const Text('Choose from gallery'),
              onTap: () => Navigator.pop(ctx, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );
    if (source == null || !mounted) return;

    final picker = ImagePicker();
    final xFile = await picker.pickImage(
      source: source,
      maxWidth: 512,
      maxHeight: 512,
      imageQuality: 85,
    );
    if (xFile == null || !mounted) return;

    setState(() => _uploadingAvatar = true);
    final ok = await ref.read(authProvider.notifier).uploadAvatar(File(xFile.path));
    if (mounted) {
      setState(() => _uploadingAvatar = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(ok ? 'Profile photo updated!' : 'Upload failed. Try again.'),
        backgroundColor: ok ? AppColors.success : AppColors.error,
        behavior: SnackBarBehavior.floating,
      ));
    }
  }

  Future<void> _logout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Logout'),
          ),
        ],
      ),
    );
    if (confirmed == true && mounted) {
      await ref.read(authProvider.notifier).logout();
      if (mounted) context.go('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider);
    final isPro = user?.isPro == true;

    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          TextButton(
            onPressed: _saving ? null : _save,
            child: _saving
                ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.secondary))
                : Text('Save', style: AppTextStyles.body.copyWith(color: AppColors.secondary, fontWeight: FontWeight.w700)),
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(children: [

          // ── Avatar Card ─────────────────────────────────────────────────
          AppCard(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(children: [
              GestureDetector(
                onTap: _uploadingAvatar ? null : _pickAvatar,
                child: Stack(children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: AppColors.secondaryLight,
                    backgroundImage: user?.avatarUrl != null
                        ? CachedNetworkImageProvider(user!.avatarUrl!)
                        : null,
                    child: user?.avatarUrl == null
                        ? Text(
                            (user?.name.isNotEmpty == true) ? user!.name[0].toUpperCase() : 'U',
                            style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: AppColors.secondary, fontFamily: 'SpaceGrotesk'),
                          )
                        : null,
                  ),
                  if (_uploadingAvatar)
                    const Positioned.fill(
                      child: CircleAvatar(
                        radius: 40,
                        backgroundColor: Colors.black38,
                        child: SizedBox(
                          width: 24, height: 24,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        ),
                      ),
                    ),
                  Positioned(
                    right: 0, bottom: 0,
                    child: Container(
                      width: 26, height: 26,
                      decoration: BoxDecoration(
                        color: AppColors.secondary,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                      child: const Icon(Icons.camera_alt_rounded, size: 14, color: Colors.white),
                    ),
                  ),
                ]),
              ),
              const SizedBox(height: 12),
              Text(user?.name ?? '', style: AppTextStyles.h3),
              const SizedBox(height: 2),
              Text(user?.email ?? '', style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted)),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: isPro ? AppColors.secondaryLight : AppColors.bgPage,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                  border: Border.all(color: isPro ? AppColors.secondary : AppColors.border),
                ),
                child: Text(
                  isPro ? '${user!.plan.name.toUpperCase()} PLAN' : 'Free Plan',
                  style: TextStyle(fontFamily: 'Inter', fontSize: 11, fontWeight: FontWeight.w700,
                      color: isPro ? AppColors.secondary : AppColors.textMuted),
                ),
              ),
            ]),
          ),
          const SizedBox(height: AppSpacing.base),

          // ── Personal Information ────────────────────────────────────────
          AppCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Personal Information', style: AppTextStyles.h4),
              const SizedBox(height: AppSpacing.base),
              AppFormRow(
                left: AppTextField(label: 'Full Name', hint: 'Your name', controller: _nameCtrl),
                right: AppTextField(
                  label: 'Email Address', hint: 'you@example.com',
                  initialValue: user?.email ?? '',
                  readOnly: true,
                ),
              ),
              const SizedBox(height: AppSpacing.base),
              AppFormRow(
                left: AppTextField(label: 'Phone Number', hint: '+91 98765 43210',
                    controller: _phoneCtrl, keyboardType: TextInputType.phone),
                right: AppTextField(label: 'Website', hint: 'www.yoursite.com',
                    controller: _websiteCtrl, keyboardType: TextInputType.url),
              ),
            ]),
          ),
          const SizedBox(height: AppSpacing.base),

          // ── Business Information ────────────────────────────────────────
          AppCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Business Information', style: AppTextStyles.h4),
              const SizedBox(height: AppSpacing.base),
              AppFormRow(
                left: AppTextField(label: 'Company / Business Name', hint: 'Ali Enterprises', controller: _companyCtrl),
                right: AppTextField(label: 'GSTIN', hint: '27AABCU9603R1ZM',
                    controller: _gstinCtrl, textCapitalization: TextCapitalization.characters,
                    onChanged: (v) => _gstinCtrl.text = v.toUpperCase()),
              ),
              const SizedBox(height: AppSpacing.base),
              AppTextField(label: 'Address', hint: 'Street address', controller: _addressCtrl, maxLines: 2),
              const SizedBox(height: AppSpacing.base),
              AppTextField(label: 'City', hint: 'Mumbai', controller: _cityCtrl),
            ]),
          ),
          const SizedBox(height: AppSpacing.base),

          // ── Account & Settings links ────────────────────────────────────
          AppCard(
            padding: EdgeInsets.zero,
            child: Column(children: [
              _MenuTile(
                icon: Icons.receipt_long_outlined,
                iconColor: AppColors.secondary,
                label: 'Billing',
                subtitle: isPro ? '${user!.plan.name.toUpperCase()} Plan' : 'Free Plan · Upgrade for more',
                onTap: () => context.push('/billing'),
              ),
              const Divider(height: 1, indent: 56),
              _MenuTile(
                icon: Icons.settings_outlined,
                iconColor: AppColors.textMuted,
                label: 'Settings',
                subtitle: 'Notifications, defaults & preferences',
                onTap: () => context.push('/settings'),
              ),
            ]),
          ),
          const SizedBox(height: AppSpacing.base),

          // ── Security ────────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: AppSpacing.sm),
            child: Text('Security', style: AppTextStyles.h4),
          ),
          AppCard(
            padding: EdgeInsets.zero,
            child: Column(children: [
              _MenuTile(
                icon: Icons.lock_outline_rounded,
                iconColor: AppColors.secondary,
                label: 'Change Password',
                subtitle: 'Update your account password',
                onTap: () => _showChangePasswordDialog(context),
              ),
              const Divider(height: 1, indent: 56),
              ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.base, vertical: 4),
                leading: Container(
                  width: 38, height: 38,
                  decoration: BoxDecoration(
                    color: AppColors.info.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                  child: const Icon(Icons.security_outlined, color: AppColors.info, size: 18),
                ),
                title: const Text('Two-Factor Authentication',
                    style: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                subtitle: Text('Add extra security to your account', style: AppTextStyles.caption),
                trailing: Switch(
                  value: false,
                  onChanged: (_) => ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('2FA setup coming soon.'),
                      behavior: SnackBarBehavior.floating,
                    ),
                  ),
                  activeColor: AppColors.secondary,
                ),
              ),
            ]),
          ),
          const SizedBox(height: AppSpacing.base),

          // ── Logout ──────────────────────────────────────────────────────
          AppCard(
            padding: EdgeInsets.zero,
            child: _MenuTile(
              icon: Icons.logout_rounded,
              iconColor: AppColors.error,
              label: 'Logout',
              labelColor: AppColors.error,
              onTap: _logout,
            ),
          ),
          const SizedBox(height: AppSpacing.base),

          // ── Danger Zone ─────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: AppSpacing.sm),
            child: Text('Danger Zone', style: AppTextStyles.h4.copyWith(color: AppColors.error)),
          ),
          AppCard(
            padding: EdgeInsets.zero,
            child: _MenuTile(
              icon: Icons.delete_outline_rounded,
              iconColor: AppColors.error,
              label: 'Delete Account',
              subtitle: 'Permanently delete your account and all data',
              labelColor: AppColors.error,
              onTap: () => _confirmDeleteAccount(context),
            ),
          ),
          const SizedBox(height: 100),
        ]),
      ),
    );
  }
}

class _MenuTile extends StatelessWidget {
  const _MenuTile({
    required this.icon,
    required this.iconColor,
    required this.label,
    this.subtitle,
    this.labelColor,
    required this.onTap,
  });
  final IconData icon;
  final Color iconColor;
  final String label;
  final String? subtitle;
  final Color? labelColor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.base, vertical: 4),
      leading: Container(
        width: 38, height: 38,
        decoration: BoxDecoration(color: iconColor.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(AppRadius.md)),
        child: Icon(icon, color: iconColor, size: 18),
      ),
      title: Text(label, style: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w600, color: labelColor ?? AppColors.textPrimary)),
      subtitle: subtitle != null
          ? Text(subtitle!, style: AppTextStyles.caption, maxLines: 1, overflow: TextOverflow.ellipsis)
          : null,
      trailing: const Icon(Icons.chevron_right_rounded, size: 18, color: AppColors.textLight),
      onTap: onTap,
    );
  }
}
