package com.docminty.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @SuppressWarnings("unchecked")
    public Map<String, Object> upload(MultipartFile file, String folder) throws IOException {
        try {
            return (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "auto"
                    ));
        } catch (IOException e) {
            log.error("Cloudinary upload failed", e);
            throw e;
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> upload(byte[] fileBytes, String folder) throws IOException {
        try {
            return (Map<String, Object>) cloudinary.uploader().upload(fileBytes,
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "auto"
                    ));
        } catch (IOException e) {
            log.error("Cloudinary byte upload failed", e);
            throw e;
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> delete(String publicId) throws IOException {
        try {
            return (Map<String, Object>) cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.error("Cloudinary deletion failed for publicId: {}", publicId, e);
            throw e;
        }
    }
}
