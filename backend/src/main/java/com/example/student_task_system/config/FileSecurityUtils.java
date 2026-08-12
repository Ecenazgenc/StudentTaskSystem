package com.example.student_task_system.config;

import com.example.student_task_system.exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class FileSecurityUtils {

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "zip", "rar", "jpg", "jpeg", "png"
    );

    public static String sanitizeFileName(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            throw new BadRequestException("Geçersiz dosya adı");
        }

        // Path traversal tespiti
        if (fileName.contains("..") || fileName.contains("/") || fileName.contains("\\") || fileName.contains("\0")) {
            throw new BadRequestException("Güvenlik İhlali: Geçersiz dosya dizini (Path Traversal)");
        }

        // Uzantı kontrolü (Beyaz Liste)
        String extension = getFileExtension(fileName).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("İzin verilmeyen dosya uzantısı: ." + extension);
        }

        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private static String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(lastDotIndex + 1);
    }
}
