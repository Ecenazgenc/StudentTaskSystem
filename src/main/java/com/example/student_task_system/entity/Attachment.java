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

@Entity
@Table(name = "Attachments")
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AttachmentId")
    private int attachmentId;

    @Column(name = "FileName")
    private String fileName;

    @Column(name = "FilePath")
    private String filePath;

    @Column(name = "UploadDate")
    private LocalDateTime uploadDate;


    @ManyToOne
    @JoinColumn(name = "TaskId")
    private Task task;


    public Attachment() {}

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
}