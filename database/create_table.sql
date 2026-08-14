CREATE DATABASE StudentTaskSystemDB;
GO

USE StudentTaskSystemDB;
GO


-- Roller Tablosu
CREATE TABLE Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL
);


-- Kullanýcýlar Tablosu
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    RoleId INT NOT NULL,

    CONSTRAINT FK_Users_Roles
    FOREIGN KEY (RoleId)
    REFERENCES Roles(RoleId)
);


-- Dersler Tablosu
CREATE TABLE Courses (
    CourseId INT IDENTITY(1,1) PRIMARY KEY,
    CourseName VARCHAR(100) NOT NULL,
    UserId INT NOT NULL,

    CONSTRAINT FK_Courses_Users
    FOREIGN KEY (UserId)
    REFERENCES Users(UserId)
);


-- Kategoriler Tablosu
CREATE TABLE Categories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName VARCHAR(50) NOT NULL
);


-- Görevler Tablosu
CREATE TABLE Tasks (
    TaskId INT IDENTITY(1,1) PRIMARY KEY,
    Title VARCHAR(150) NOT NULL,
    Description VARCHAR(MAX),
    DueDate DATE,
    Status VARCHAR(50) NOT NULL,
    Priority VARCHAR(50) NOT NULL,

    UserId INT NOT NULL,
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


-- Yorumlar Tablosu
CREATE TABLE Comments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,
    CommentText VARCHAR(MAX) NOT NULL,
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



-- Dosya Ekleri Tablosu
CREATE TABLE Attachments (
    AttachmentId INT IDENTITY(1,1) PRIMARY KEY,
    FileName VARCHAR(255) NOT NULL,
    FilePath VARCHAR(500) NOT NULL,
    UploadDate DATETIME DEFAULT GETDATE(),

    TaskId INT NOT NULL,


    CONSTRAINT FK_Attachments_Tasks
    FOREIGN KEY (TaskId)
    REFERENCES Tasks(TaskId)
);



-- Bildirimler Tablosu
CREATE TABLE Notifications (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    Message VARCHAR(500) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),

    UserId INT NOT NULL,


    CONSTRAINT FK_Notifications_Users
    FOREIGN KEY (UserId)
    REFERENCES Users(UserId)
);

-- Notlar Tablosu
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
