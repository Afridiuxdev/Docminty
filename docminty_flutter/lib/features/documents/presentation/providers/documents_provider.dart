import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/document_model.dart';
import '../../data/repositories/documents_repository.dart';

// ─── Fetch list ───────────────────────────────────────────────────────────────
final documentsProvider =
    AsyncNotifierProvider<DocumentsNotifier, List<DocumentModel>>(
  DocumentsNotifier.new,
);

class DocumentsNotifier extends AsyncNotifier<List<DocumentModel>> {
  @override
  Future<List<DocumentModel>> build() async {
    return ref.read(documentsRepositoryProvider).getMyDocuments();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(documentsRepositoryProvider).getMyDocuments(),
    );
  }

  Future<bool> save(SaveDocumentRequest req) async {
    try {
      final doc = await ref
          .read(documentsRepositoryProvider)
          .saveDocument(req);
      // Prepend to list
      final current = state.valueOrNull ?? [];
      state = AsyncData([doc, ...current]);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> updateDoc(int id, SaveDocumentRequest req) async {
    try {
      final doc = await ref
          .read(documentsRepositoryProvider)
          .updateDocument(id, req);
      final current = state.valueOrNull ?? [];
      state = AsyncData(current.map((d) => d.id == id ? doc : d).toList());
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> delete(int id) async {
    try {
      await ref.read(documentsRepositoryProvider).deleteDocument(id);
      final current = state.valueOrNull ?? [];
      state = AsyncData(current.where((d) => d.id != id).toList());
      return true;
    } catch (e) {
      return false;
    }
  }
}
