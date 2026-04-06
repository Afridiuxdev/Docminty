import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_text_field.dart';

class QrGeneratorScreen extends StatefulWidget {
  const QrGeneratorScreen({super.key});

  @override
  State<QrGeneratorScreen> createState() => _QrGeneratorScreenState();
}

class _QrGeneratorScreenState extends State<QrGeneratorScreen> {
  final _controller = TextEditingController();
  final _qrKey = GlobalKey();
  String _qrData = '';
  String _selectedType = 'Text';
  bool _sharing = false;

  static const _types = ['Text', 'URL', 'Email', 'Phone', 'WhatsApp', 'UPI'];

  String get _hint => switch (_selectedType) {
        'URL' => 'https://example.com',
        'Email' => 'example@email.com',
        'Phone' => '+91 98765 43210',
        'WhatsApp' => '+91 98765 43210',
        'UPI' => 'name@upi',
        _ => 'Enter text for QR code',
      };

  String _buildQrValue(String input) {
    if (input.isEmpty) return '';
    return switch (_selectedType) {
      'Email' => input.startsWith('mailto:') ? input : 'mailto:$input',
      'Phone' => input.startsWith('tel:') ? input : 'tel:$input',
      'WhatsApp' =>
        'https://wa.me/${input.replaceAll(RegExp(r'[^\d]'), '')}',
      'UPI' => 'upi://pay?pa=$input',
      _ => input,
    };
  }

  Future<void> _shareQr() async {
    if (_qrData.isEmpty) return;
    setState(() => _sharing = true);
    try {
      final boundary =
          _qrKey.currentContext?.findRenderObject() as RenderRepaintBoundary?;
      if (boundary == null) return;
      final image = await boundary.toImage(pixelRatio: 3.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      final bytes = byteData!.buffer.asUint8List();
      final dir = await getTemporaryDirectory();
      final file = File('${dir.path}/qr_code.png');
      await file.writeAsBytes(bytes);
      await Share.shareXFiles(
        [XFile(file.path)],
        subject: 'QR Code from DocMinty',
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _sharing = false);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(title: const Text('QR Code Generator')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Type selector ─────────────────────────────────────────────
            Text('QR Type', style: AppTextStyles.h4),
            const SizedBox(height: AppSpacing.sm),
            SizedBox(
              height: 38,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _types.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (_, i) {
                  final t = _types[i];
                  final sel = _selectedType == t;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedType = t;
                        _controller.clear();
                        _qrData = '';
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: sel
                            ? AppColors.secondary
                            : AppColors.bgCard,
                        borderRadius:
                            BorderRadius.circular(AppRadius.full),
                        border: Border.all(
                          color: sel
                              ? AppColors.secondary
                              : AppColors.border,
                        ),
                      ),
                      child: Text(
                        t,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: sel ? Colors.white : AppColors.textMuted,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // ── Input ─────────────────────────────────────────────────────
            AppTextField(
              label: _selectedType,
              hint: _hint,
              controller: _controller,
              onChanged: (_) => setState(() {}),
              keyboardType: _selectedType == 'Phone' ||
                      _selectedType == 'WhatsApp'
                  ? TextInputType.phone
                  : _selectedType == 'Email'
                      ? TextInputType.emailAddress
                      : _selectedType == 'URL'
                          ? TextInputType.url
                          : TextInputType.text,
            ),
            const SizedBox(height: AppSpacing.base),
            AppButton(
              label: 'Generate QR Code',
              onPressed: _controller.text.trim().isEmpty
                  ? null
                  : () => setState(() {
                        _qrData =
                            _buildQrValue(_controller.text.trim());
                      }),
              width: double.infinity,
            ),
            const SizedBox(height: AppSpacing.xl),

            // ── QR Preview ────────────────────────────────────────────────
            if (_qrData.isNotEmpty) ...[
              Center(
                child: AppCard(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  child: Column(
                    children: [
                      RepaintBoundary(
                        key: _qrKey,
                        child: Container(
                          color: Colors.white,
                          padding: const EdgeInsets.all(12),
                          child: QrImageView(
                            data: _qrData,
                            version: QrVersions.auto,
                            size: 220,
                            gapless: false,
                            eyeStyle: const QrEyeStyle(
                              eyeShape: QrEyeShape.square,
                              color: Color(0xFF0F172A),
                            ),
                            dataModuleStyle: const QrDataModuleStyle(
                              dataModuleShape: QrDataModuleShape.square,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.base),
                      Text(
                        _qrData,
                        textAlign: TextAlign.center,
                        style: AppTextStyles.caption,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: AppSpacing.base),
                      AppButton(
                        label: _sharing ? 'Saving...' : 'Share / Save QR',
                        icon: const Icon(Icons.share_rounded,
                            color: Colors.white, size: 16),
                        onPressed: _sharing ? null : _shareQr,
                        loading: _sharing,
                        width: double.infinity,
                      ),
                    ],
                  ),
                ),
              ),
            ],
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }
}
