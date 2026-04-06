import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_card.dart';

// ─── Settings Provider ────────────────────────────────────────────────────────
class _Settings {
  final bool notifyDocCreated;
  final bool notifyPdfDownloaded;
  final bool notifyMarketing;
  final String defaultGstRate;
  final String defaultTaxType;
  final String dateFormat;
  final bool autoSave;

  const _Settings({
    this.notifyDocCreated = true,
    this.notifyPdfDownloaded = false,
    this.notifyMarketing = false,
    this.defaultGstRate = '18%',
    this.defaultTaxType = 'CGST + SGST',
    this.dateFormat = 'DD/MM/YYYY',
    this.autoSave = true,
  });

  _Settings copyWith({
    bool? notifyDocCreated, bool? notifyPdfDownloaded, bool? notifyMarketing,
    String? defaultGstRate, String? defaultTaxType, String? dateFormat, bool? autoSave,
  }) => _Settings(
    notifyDocCreated: notifyDocCreated ?? this.notifyDocCreated,
    notifyPdfDownloaded: notifyPdfDownloaded ?? this.notifyPdfDownloaded,
    notifyMarketing: notifyMarketing ?? this.notifyMarketing,
    defaultGstRate: defaultGstRate ?? this.defaultGstRate,
    defaultTaxType: defaultTaxType ?? this.defaultTaxType,
    dateFormat: dateFormat ?? this.dateFormat,
    autoSave: autoSave ?? this.autoSave,
  );
}

class _SettingsNotifier extends StateNotifier<_Settings> {
  _SettingsNotifier() : super(const _Settings()) {
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    state = _Settings(
      notifyDocCreated:    prefs.getBool('notifyDocCreated') ?? true,
      notifyPdfDownloaded: prefs.getBool('notifyPdfDownloaded') ?? false,
      notifyMarketing:     prefs.getBool('notifyMarketing') ?? false,
      defaultGstRate:      prefs.getString('defaultGstRate') ?? '18%',
      defaultTaxType:      prefs.getString('defaultTaxType') ?? 'CGST + SGST',
      dateFormat:          prefs.getString('dateFormat') ?? 'DD/MM/YYYY',
      autoSave:            prefs.getBool('autoSave') ?? true,
    );
  }

  Future<void> _save(_Settings s) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('notifyDocCreated', s.notifyDocCreated);
    await prefs.setBool('notifyPdfDownloaded', s.notifyPdfDownloaded);
    await prefs.setBool('notifyMarketing', s.notifyMarketing);
    await prefs.setString('defaultGstRate', s.defaultGstRate);
    await prefs.setString('defaultTaxType', s.defaultTaxType);
    await prefs.setString('dateFormat', s.dateFormat);
    await prefs.setBool('autoSave', s.autoSave);
  }

  void toggle(String key) {
    final next = switch (key) {
      'notifyDocCreated'    => state.copyWith(notifyDocCreated: !state.notifyDocCreated),
      'notifyPdfDownloaded' => state.copyWith(notifyPdfDownloaded: !state.notifyPdfDownloaded),
      'notifyMarketing'     => state.copyWith(notifyMarketing: !state.notifyMarketing),
      'autoSave'            => state.copyWith(autoSave: !state.autoSave),
      _ => state,
    };
    state = next;
    _save(next);
  }

  void setString(String key, String value) {
    final next = switch (key) {
      'defaultGstRate' => state.copyWith(defaultGstRate: value),
      'defaultTaxType' => state.copyWith(defaultTaxType: value),
      'dateFormat'     => state.copyWith(dateFormat: value),
      _ => state,
    };
    state = next;
    _save(next);
  }
}

final _settingsProvider = StateNotifierProvider<_SettingsNotifier, _Settings>(
  (_) => _SettingsNotifier(),
);

// ─── Screen ───────────────────────────────────────────────────────────────────
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  static const _gstRates  = ['0%', '5%', '12%', '18%', '28%'];
  static const _taxTypes  = ['CGST + SGST', 'IGST', 'No GST'];
  static const _dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final s = ref.watch(_settingsProvider);
    final n = ref.read(_settingsProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: const Text('Settings'),
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded), onPressed: () => context.pop()),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [

          // ── Email Notifications ─────────────────────────────────────────
          _SectionHeader(title: 'Email Notifications', subtitle: 'Choose which emails you receive'),
          AppCard(
            padding: EdgeInsets.zero,
            child: Column(children: [
              _ToggleTile(
                title: 'Document Created',
                subtitle: 'Email when a document is generated',
                value: s.notifyDocCreated,
                onChanged: (_) => n.toggle('notifyDocCreated'),
              ),
              const Divider(height: 1, indent: 16),
              _ToggleTile(
                title: 'PDF Downloaded',
                subtitle: 'Email when a PDF is downloaded',
                value: s.notifyPdfDownloaded,
                onChanged: (_) => n.toggle('notifyPdfDownloaded'),
              ),
              const Divider(height: 1, indent: 16),
              _ToggleTile(
                title: 'Marketing Emails',
                subtitle: 'Tips, product updates and offers from DocMinty',
                value: s.notifyMarketing,
                onChanged: (_) => n.toggle('notifyMarketing'),
              ),
            ]),
          ),
          const SizedBox(height: AppSpacing.lg),

          // ── Document Defaults ───────────────────────────────────────────
          _SectionHeader(title: 'Document Defaults', subtitle: 'Pre-fill settings for new documents'),
          AppCard(
            padding: EdgeInsets.zero,
            child: Column(children: [
              _DropdownTile(
                title: 'Default GST Rate',
                value: _gstRates.contains(s.defaultGstRate) ? s.defaultGstRate : '18%',
                items: _gstRates,
                onChanged: (v) { if (v != null) n.setString('defaultGstRate', v); },
              ),
              const Divider(height: 1, indent: 16),
              _DropdownTile(
                title: 'Default Tax Type',
                value: _taxTypes.contains(s.defaultTaxType) ? s.defaultTaxType : 'CGST + SGST',
                items: _taxTypes,
                onChanged: (v) { if (v != null) n.setString('defaultTaxType', v); },
              ),
              const Divider(height: 1, indent: 16),
              _DropdownTile(
                title: 'Date Format',
                value: _dateFormats.contains(s.dateFormat) ? s.dateFormat : 'DD/MM/YYYY',
                items: _dateFormats,
                onChanged: (v) { if (v != null) n.setString('dateFormat', v); },
              ),
            ]),
          ),
          const SizedBox(height: AppSpacing.lg),

          // ── Auto-save ───────────────────────────────────────────────────
          _SectionHeader(title: 'Document Saving'),
          AppCard(
            padding: EdgeInsets.zero,
            child: _ToggleTile(
              title: 'Auto-save Documents',
              subtitle: 'Automatically save documents to your account',
              value: s.autoSave,
              onChanged: (_) => n.toggle('autoSave'),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // ── App Info ────────────────────────────────────────────────────
          AppCard(
            padding: EdgeInsets.zero,
            child: Column(children: [
              _InfoTile(title: 'App Version', value: '1.0.0'),
              const Divider(height: 1, indent: 16),
              _InfoTile(title: 'Privacy Policy', trailing: const Icon(Icons.open_in_new_rounded, size: 14, color: AppColors.textLight)),
              const Divider(height: 1, indent: 16),
              _InfoTile(title: 'Terms of Service', trailing: const Icon(Icons.open_in_new_rounded, size: 14, color: AppColors.textLight)),
            ]),
          ),
          const SizedBox(height: 80),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title, this.subtitle});
  final String title;
  final String? subtitle;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: AppSpacing.sm),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: AppTextStyles.h4),
      if (subtitle != null)
        Text(subtitle!, style: AppTextStyles.caption),
    ]),
  );
}

class _ToggleTile extends StatelessWidget {
  const _ToggleTile({required this.title, this.subtitle, required this.value, required this.onChanged});
  final String title;
  final String? subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) => ListTile(
    contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.base, vertical: 2),
    title: Text(title, style: const TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
    subtitle: subtitle != null ? Text(subtitle!, style: AppTextStyles.caption) : null,
    trailing: Switch(value: value, onChanged: onChanged, activeColor: AppColors.secondary),
  );
}

class _DropdownTile extends StatelessWidget {
  const _DropdownTile({required this.title, required this.value, required this.items, required this.onChanged});
  final String title;
  final String value;
  final List<String> items;
  final ValueChanged<String?> onChanged;

  @override
  Widget build(BuildContext context) => ListTile(
    contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.base, vertical: 2),
    title: Text(title, style: const TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
    trailing: DropdownButton<String>(
      value: value,
      underline: const SizedBox.shrink(),
      style: const TextStyle(fontFamily: 'Inter', fontSize: 13, color: AppColors.textPrimary),
      items: items.map((v) => DropdownMenuItem(value: v, child: Text(v))).toList(),
      onChanged: onChanged,
    ),
  );
}

class _InfoTile extends StatelessWidget {
  const _InfoTile({required this.title, this.value, this.trailing});
  final String title;
  final String? value;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) => ListTile(
    contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.base, vertical: 2),
    title: Text(title, style: const TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary)),
    trailing: value != null
        ? Text(value!, style: AppTextStyles.bodySm.copyWith(color: AppColors.textMuted))
        : trailing,
  );
}
