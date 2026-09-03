CREATE DATABASE StudentTaskSystemDB;
GO

USE StudentTaskSystemDB;
GO

-- 1. Roller Tablosu (Roles)
CREATE TABLE Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL
);

-- 2. Kullanıcılar Tablosu (Users)
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    RoleId INT NOT NULL,
    AvatarUrl NVARCHAR(500) NULL,

    CONSTRAINT FK_Users_Roles
    FOREIGN KEY (RoleId)
    REFERENCES Roles(RoleId)
);

-- 3. Dersler Tablosu (Courses)
CREATE TABLE Courses (
    CourseId INT IDENTITY(1,1) PRIMARY KEY,
    CourseName NVARCHAR(100) NOT NULL,
    UserId INT NOT NULL,

    CONSTRAINT FK_Courses_Users
    FOREIGN KEY (UserId)
    REFERENCES Users(UserId)
);

-- 4. Kategoriler Tablosu (Categories)
CREATE TABLE Categories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(50) NOT NULL
);

-- 5. Görevler Tablosu (Tasks)
CREATE TABLE Tasks (
    TaskId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(150) NOT NULL,
    Description NVARCHAR(MAX),
    DueDate DATE,
    Status NVARCHAR(50) NOT NULL,
    Priority NVARCHAR(50) NOT NULL,
    UserId INT NULL,
    CourseId INT NOT NULL,
    CategoryId INT NOT NULL,

    CONSTRAINT FK_Tasks_Users
    FOREIGN KEY (UserId)
    REFERENCES Users(UserId),

    CONSTRAINT FK_Tasks_Courses
    FOREIGN KEY (CourseId)
    REFERENCES Courses(CourseId),

    CONSTRAINT FK_Tasks_Categories
    FOREIGN KEY (CategoryId)
    REFERENCES Categories(CategoryId)
);

-- 6. Yorumlar Tablosu (Comments)
CREATE TABLE Comments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,
    CommentText NVARCHAR(MAX) NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    TaskId INT NOT NULL,
    UserId INT NOT NULL,

    CONSTRAINT FK_Comments_Tasks
    FOREIGN KEY (TaskId)
    REFERENCES Tasks(TaskId),

    CONSTRAINT FK_Comments_Users
    FOREIGN KEY (UserId)
    REFERENCES Users(UserId)
);

-- 7. Dosya Ekleri Tablosu (Attachments)
CREATE TABLE Attachments (
    AttachmentId INT IDENTITY(1,1) PRIMARY KEY,
    FileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    UploadDate DATETIME DEFAULT GETDATE(),
    TaskId INT NOT NULL,
    UserId INT NULL,

    CONSTRAINT FK_Attachments_Tasks
    FOREIGN KEY (TaskId)
    REFERENCES Tasks(TaskId),

    CONSTRAINT FK_Attachments_Users
    FOREIGN KEY (UserId)
    REFERENCES Users(UserId)
);

-- 8. Bildirimler Tablosu (Notifications)
CREATE TABLE Notifications (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    Message NVARCHAR(500) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UserId INT NULL,

    CONSTRAINT FK_Notifications_Users
    FOREIGN KEY (UserId)
    REFERENCES Users(UserId)
);

-- 9. Notlar Tablosu (Notes)
CREATE TABLE Notes (
    NoteId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(150) NOT NULL,
    Content NVARCHAR(MAX),
    Tag NVARCHAR(50),
    Color VARCHAR(20) DEFAULT 'amber',
    IsPinned BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE(),
    UserId INT NOT NULL,
    CourseId INT NULL,
    TaskId INT NULL,

    CONSTRAINT FK_Notes_Users
    FOREIGN KEY (UserId)
    REFERENCES Users(UserId),

    CONSTRAINT FK_Notes_Courses
    FOREIGN KEY (CourseId)
    REFERENCES Courses(CourseId),

    CONSTRAINT FK_Notes_Tasks
    FOREIGN KEY (TaskId)
    REFERENCES Tasks(TaskId)
);

-- 10. Oturum Yenileme Jetonları (RefreshTokens)
CREATE TABLE RefreshTokens (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Token NVARCHAR(255) UNIQUE NOT NULL,
    ExpiryDate DATETIME NOT NULL,

    CONSTRAINT FK_RefreshTokens_Users
    FOREIGN KEY (UserId)
    REFERENCES Users(UserId)
);

-- 11. Şifre Sıfırlama Jetonları (PasswordResetTokens)
CREATE TABLE PasswordResetTokens (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Token NVARCHAR(255) UNIQUE NOT NULL,
    ExpiryDate DATETIME NOT NULL,

    CONSTRAINT FK_PasswordResetTokens_Users
    FOREIGN KEY (UserId)
    REFERENCES Users(UserId)
);
GO
