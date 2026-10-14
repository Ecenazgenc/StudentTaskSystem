package com.example.student_task_system.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Eklenti (Attachment) varlık sınıfı, veritabanındaki "Attachments" tablosunu temsil eder.
@Entity
@Table(name = "Attachments")
public class Attachment {

    // Eklentinin benzersiz kimliği (Birincil anahtar)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AttachmentId")
    private int attachmentId;

    // Dosyanın adı
    @Column(name = "FileName")
    private String fileName;

    // Dosyanın saklandığı yol (Path)
    @Column(name = "FilePath", columnDefinition = "VARCHAR(MAX)")
    private String filePath;

    // Dosyanın yüklenme tarihi ve saati
    @Column(name = "UploadDate")
    private LocalDateTime uploadDate;

    // Eklentinin ait olduğu görev (Çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "TaskId")
    private Task task;

    // Eklentiyi yükleyen kullanıcı (Çoka-bir ilişki)
    @ManyToOne
    @JoinColumn(name = "UserId")
    private User user;

    // Varsayılan kurucu metot
    public Attachment() {}

    // Getter ve Setter metotları
    public int getAttachmentId() {return attachmentId;}
    public void setAttachmentId(int attachmentId) { this.attachmentId = attachmentId;}

    public String getFileName() {return fileName;}
    public void setFileName(String fileName) {this.fileName = fileName;}

    public String getFilePath() {return filePath;}
    public void setFilePath(String filePath) { this.filePath = filePath;}

    public LocalDateTime getUploadDate() { return uploadDate;}
    public void setUploadDate(LocalDateTime uploadDate) {this.uploadDate = uploadDate;}

    public Task getTask() { return task;}
    public void setTask(Task task) {this.task = task;}

    public User getUser() { return user;}
    public void setUser(User user) {this.user = user;}
}