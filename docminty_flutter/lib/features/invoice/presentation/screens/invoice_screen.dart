import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../features/documents/data/models/document_model.dart';
import '../../../../features/documents/presentation/providers/documents_provider.dart';
import '../../data/models/invoice_form.dart';
import '../providers/invoice_provider.dart';
import '../widgets/invoice_form_tabs.dart';
import '../widgets/invoice_preview_widget.dart';
import '../../pdf/invoice_pdf_generator.dart';

class InvoiceScreen extends ConsumerStatefulWidget {
  const InvoiceScreen({super.key, this.savedDocument});
  final DocumentModel? savedDocument;

  @override
  ConsumerState<InvoiceScreen> createState() => _InvoiceScreenState();
}

class _InvoiceScreenState extends ConsumerState<InvoiceScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _showPreview = false;
  bool _saving = false;
  bool _downloading = false;

  static const _tabs = [
    'Your Details',
    'Client',
    'Items',
    'Settings',
    'Templates',
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);

    // Load from saved doc if editing
    if (widget.savedDocument != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        try {
          final form =
              InvoiceForm.fromJson(widget.savedDocument!.parsedFormData);
          ref.read(invoiceFormProvider.notifier).loadFromSaved(form);
        } catch (_) {}
      });
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _downloadPdf() async {
    setState(() => _downloading = true);
    try {
      final form = ref.read(invoiceFormProvider);
      await InvoicePdfGenerator.generateAndShare(form);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('PDF error: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _downloading = false);
    }
  }

  Future<void> _saveDocument() async {
    setState(() => _saving = true);
    final form = ref.read(invoiceFormProvider);
    final req = SaveDocumentRequest(
      docType: 'invoice',
      title: 'Invoice ${form.invoiceNumber}',
      templateName: form.templateName,
      referenceNumber: form.invoiceNumber,
      partyName: form.toName,
      amount: form.grandTotal,
      formData: form.toJsonString(),
    );

    final bool ok;
    if (widget.savedDocument != null) {
      // Editing an existing document — update in place
      ok = await ref
          .read(documentsProvider.notifier)
          .updateDoc(widget.savedDocument!.id, req);
    } else {
      // New document
      ok = await ref.read(documentsProvider.notifier).save(req);
    }

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(ok ? 'Invoice saved!' : 'Failed to save. Try again.'),
          backgroundColor: ok ? AppColors.success : AppColors.error,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
    if (mounted) setState(() => _saving = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPage,
      appBar: AppBar(
        title: Text(widget.savedDocument != null ? 'Edit Invoice' : 'New Invoice'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.pop(),
        ),
        actions: [
          // Preview toggle
          IconButton(
            icon: Icon(
              _showPreview
                  ? Icons.edit_rounded
                  : Icons.remove_red_eye_rounded,
              color: AppColors.secondary,
            ),
            tooltip: _showPreview ? 'Edit' : 'Preview',
            onPressed: () => setState(() => _showPreview = !_showPreview),
          ),
          // Save
          IconButton(
            icon: _saving
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: AppColors.secondary,
                    ),
                  )
                : const Icon(Icons.cloud_upload_rounded,
                    color: AppColors.secondary),
            tooltip: 'Save',
            onPressed: _saving ? null : _saveDocument,
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: _showPreview ? _buildPreviewView() : _buildFormView(),
      floatingActionButton: _showPreview
          ? FloatingActionButton.extended(
              onPressed: _downloading ? null : _downloadPdf,
              backgroundColor: AppColors.secondary,
              icon: _downloading
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Icon(Icons.download_rounded, color: Colors.white),
              label: Text(
                _downloading ? 'Generating...' : 'Download PDF',
                style: const TextStyle(
                  fontFamily: 'SpaceGrotesk',
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            )
          : null,
    );
  }

  Widget _buildFormView() {
    return Column(
      children: [
        // Tab bar
        Container(
          color: AppColors.bgCard,
          child: TabBar(
            controller: _tabController,
            isScrollable: true,
            tabAlignment: TabAlignment.start,
            indicatorColor: AppColors.secondary,
            labelColor: AppColors.secondary,
            unselectedLabelColor: AppColors.textMuted,
            labelStyle: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
            dividerColor: AppColors.border,
            tabs: _tabs.map((t) => Tab(text: t)).toList(),
          ),
        ),

        // Tab content
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              InvoiceFormTab(tabIndex: 0),
              InvoiceFormTab(tabIndex: 1),
              InvoiceFormTab(tabIndex: 2),
              InvoiceFormTab(tabIndex: 3),
              InvoiceFormTab(tabIndex: 4),
            ],
          ),
        ),

        // Next/Download footer
        _buildFormFooter(),
      ],
    );
  }

  Widget _buildFormFooter() {
    final isLastTab = _tabController.index == _tabs.length - 1;
    return Container(
      color: AppColors.bgCard,
      padding: const EdgeInsets.all(AppSpacing.base),
      child: SafeArea(
        top: false,
        child: isLastTab
            ? AppButton(
                label: 'Download PDF',
                icon: const Icon(Icons.download_rounded,
                    color: Colors.white, size: 16),
                onPressed: _downloading ? null : _downloadPdf,
                loading: _downloading,
                width: double.infinity,
              )
            : AppButton(
                label: 'Next →',
                onPressed: () {
                  _tabController.animateTo(_tabController.index + 1);
                },
                width: double.infinity,
              ),
      ),
    );
  }

  Widget _buildPreviewView() {
    return const SingleChildScrollView(
      padding: EdgeInsets.all(AppSpacing.base),
      child: InvoicePreviewWidget(),
    );
  }
}
