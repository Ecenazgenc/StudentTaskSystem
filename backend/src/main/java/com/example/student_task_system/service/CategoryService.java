package com.example.student_task_system.service;

import com.example.student_task_system.dto.CategoryDTO;
import com.example.student_task_system.entity.Category;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: id=" + id));
        return CategoryDTO.fromEntity(category);
    }

    public CategoryDTO saveCategory(CategoryDTO.Request request) {
        Category category = new Category();
        category.setCategoryName(request.categoryName());
        Category saved = categoryRepository.save(category);
        return CategoryDTO.fromEntity(saved);
    }

    public CategoryDTO updateCategory(Integer id, CategoryDTO.Request request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: id=" + id));

        category.setCategoryName(request.categoryName());
        Category saved = categoryRepository.save(category);
        return CategoryDTO.fromEntity(saved);
    }

    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Kategori bulunamadı: id=" + id);
        }
        categoryRepository.deleteById(id);
    }
}