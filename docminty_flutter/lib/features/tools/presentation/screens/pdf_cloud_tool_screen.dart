import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';

/// Generic screen for cloud-processed PDF tools (Compress, PDF↔Word).
/// Shows a file picker + coming-soon state while backend support is pending.
class PdfCloudToolScreen extends StatefulWidget {
  const PdfCloudToolScreen({
    super.key,
    required this.title,
    required this.icon,
    required this.description,
    required this.inputLabel,
    required this.inputExtensions,
    required this.outputLabel,
  });

  final String title;
  final IconData icon;
  final String description;
  final String inputLabel;
  final List<String> inputExtensions;
  final String outputLabel;

  @override
  State<PdfCloudToolScreen> createState() => _PdfCloudToolScreenState();
}

class _PdfCloudToolScreenState extends State<PdfCloudToolScreen> {
  File? _file;

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: widget.inputExtensions,
    );
    if (result?.files.single.path != null) {
      setState(() => _file = File(result!.files.single.path!));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(title: Text(widget.title)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          children: [
            // ── Description ───────────────────────────────────────────────
            AppCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.secondaryLight,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                    ),
                    child: Icon(widget.icon,
                        color: AppColors.secondary, size: 28),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(widget.title, style: AppTextStyles.h4),
                        const SizedBox(height: 2),
                        Text(widget.description,
                            style: AppTextStyles.bodySm),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.base),

            // ── Cloud badge ───────────────────────────────────────────────
            AppCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              color: const Color(0xFFF0F9FF),
              borderColor: AppColors.info,
              child: Row(
                children: [
                  const Icon(Icons.cloud_rounded,
                      color: AppColors.info, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'This tool processes your file securely on DocMinty servers. Your file is deleted immediately after conversion.',
                      style: AppTextStyles.bodySm
                          .copyWith(color: AppColors.info),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // ── File picker ───────────────────────────────────────────────
            GestureDetector(
              onTap: _pickFile,
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.xl),
                decoration: BoxDecoration(
                  color: _file != null
                      ? AppColors.secondaryLight
                      : AppColors.bgCard,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  border: Border.all(
                    color: _file != null
                        ? AppColors.secondary
                        : AppColors.border,
                  ),
                ),
                child: Column(
                  children: [
                    Icon(
                      _file != null
                          ? Icons.check_circle_rounded
                          : Icons.upload_file_rounded,
                      size: 44,
                      color: _file != null
                          ? AppColors.secondary
                          : AppColors.textLight,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      _file != null
                          ? _file!.path.split('/').last
                          : widget.inputLabel,
                      style: AppTextStyles.body.copyWith(
                        color: _file != null
                            ? AppColors.secondary
                            : AppColors.textMuted,
                        fontWeight: FontWeight.w600,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    if (_file == null) ...[
                      const SizedBox(height: 4),
                      Text(
                        widget.inputExtensions
                            .map((e) => '.$e')
                            .join(', ')
                            .toUpperCase(),
                        style: AppTextStyles.caption,
                      ),
                    ] else ...[
                      const SizedBox(height: 4),
                      TextButton(
                        onPressed: _pickFile,
                        child: const Text('Change file'),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // ── Coming soon notice ────────────────────────────────────────
            AppCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              color: const Color(0xFFFFF7ED),
              borderColor: Colors.orange,
              child: Column(
                children: [
                  const Row(
                    children: [
                      Icon(Icons.construction_rounded,
                          color: Colors.orange, size: 20),
                      SizedBox(width: 10),
                      Text('Server Processing — Coming Soon',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontWeight: FontWeight.w700,
                            color: Colors.orange,
                            fontSize: 13,
                          )),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Cloud processing for ${widget.title} is being set up on our servers. '
                    'Use DocMinty.com in your browser to access this tool now.',
                    style: AppTextStyles.bodySm
                        .copyWith(color: Colors.orange.shade800),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.base),

            AppButton(
              label: 'Convert to ${widget.outputLabel}',
              icon: Icon(widget.icon, color: Colors.white, size: 16),
              onPressed: _file == null
                  ? null
                  : () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            '${widget.title} server processing coming soon. Visit docminty.com to use this tool.',
                          ),
                          backgroundColor: AppColors.info,
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
              width: double.infinity,
            ),
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }
}
