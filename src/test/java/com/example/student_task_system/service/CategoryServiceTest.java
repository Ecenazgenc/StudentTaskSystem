package com.example.student_task_system.service;

import com.example.student_task_system.dto.CategoryDTO;
import com.example.student_task_system.entity.Category;
import com.example.student_task_system.exception.ResourceNotFoundException;
import com.example.student_task_system.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category category;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setCategoryId(1);
        category.setCategoryName("Ödev");
    }

    @Test
    void getAllCategories_ShouldReturnCategoryList() {
        when(categoryRepository.findAll()).thenReturn(List.of(category));

        List<CategoryDTO> categories = categoryService.getAllCategories();

        assertNotNull(categories);
        assertEquals(1, categories.size());
        assertEquals("Ödev", categories.get(0).categoryName());
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void getCategoryById_WhenExists_ShouldReturnCategory() {
        when(categoryRepository.findById(1)).thenReturn(Optional.of(category));

        CategoryDTO result = categoryService.getCategoryById(1);

        assertNotNull(result);
        assertEquals(1, result.categoryId());
        assertEquals("Ödev", result.categoryName());
        verify(categoryRepository, times(1)).findById(1);
    }

    @Test
    void getCategoryById_WhenNotExists_ShouldThrowException() {
        when(categoryRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.getCategoryById(999));
        verify(categoryRepository, times(1)).findById(999);
    }

    @Test
    void saveCategory_ShouldReturnSavedCategory() {
        CategoryDTO.Request request = new CategoryDTO.Request("Proje");

        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        CategoryDTO result = categoryService.saveCategory(request);

        assertNotNull(result);
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void deleteCategory_WhenExists_ShouldDelete() {
        when(categoryRepository.existsById(1)).thenReturn(true);
        doNothing().when(categoryRepository).deleteById(1);

        assertDoesNotThrow(() -> categoryService.deleteCategory(1));

        verify(categoryRepository, times(1)).existsById(1);
        verify(categoryRepository, times(1)).deleteById(1);
    }
}
