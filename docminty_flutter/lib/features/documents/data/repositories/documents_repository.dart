import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_constants.dart';
import '../../../../core/errors/app_exception.dart';
import '../models/document_model.dart';

final documentsRepositoryProvider = Provider<DocumentsRepository>((ref) {
  return DocumentsRepository(dio: ref.read(dioProvider));
});

class DocumentsRepository {
  DocumentsRepository({required this.dio});
  final Dio dio;

  Future<List<DocumentModel>> getMyDocuments() async {
    try {
      final res = await dio.get(ApiConstants.documents);
      final list = (res.data['data'] ?? res.data) as List;
      return list
          .map((j) => DocumentModel.fromJson(j as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  Future<DocumentModel> saveDocument(SaveDocumentRequest req) async {
    try {
      final res = await dio.post(
        ApiConstants.documents,
        data: req.toJson(),
      );
      final data = res.data['data'] ?? res.data;
      return DocumentModel.fromJson(data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  Future<DocumentModel> updateDocument(int id, SaveDocumentRequest req) async {
    try {
      final res = await dio.put(
        ApiConstants.deleteDocument(id), // /documents/:id
        data: req.toJson(),
      );
      final data = res.data['data'] ?? res.data;
      return DocumentModel.fromJson(data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }

  Future<void> deleteDocument(int id) async {
    try {
      await dio.delete(ApiConstants.deleteDocument(id));
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    }
  }
}
