package com.example.student_task_system.service;

import com.example.student_task_system.dto.CategoryDTO;
import com.example.student_task_system.entity.Category;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
// Kategori işlemlerini yöneten servis sınıfı
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Tüm kategorileri getirir.
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Belirtilen ID'ye sahip kategoriyi getirir.
    public CategoryDTO getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: id=" + id));
        return CategoryDTO.fromEntity(category);
    }

    // Yeni bir kategori kaydeder.
    public CategoryDTO saveCategory(CategoryDTO.Request request) {
        Category category = new Category();
        category.setCategoryName(request.categoryName());
        Category saved = categoryRepository.save(category);
        return CategoryDTO.fromEntity(saved);
    }

    // Mevcut bir kategoriyi günceller.
    public CategoryDTO updateCategory(Integer id, CategoryDTO.Request request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: id=" + id));

        category.setCategoryName(request.categoryName());
        Category saved = categoryRepository.save(category);
        return CategoryDTO.fromEntity(saved);
    }

    // Belirtilen ID'ye sahip kategoriyi siler.
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Kategori bulunamadı: id=" + id);
        }
        categoryRepository.deleteById(id);
    }
}