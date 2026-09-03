import React, { useState, useEffect, useCallback } from "react";
import { MoreVertical } from "lucide-react";

import Sidebar from "./components/Sidebar";
import TaskBoard from "./components/TaskBoard";
import TaskModal from "./components/TaskModal";
import NewTaskModal from "./components/NewTaskModal";
import EmailToast from "./components/EmailToast";

import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CoursesPage from "./pages/CoursesPage";
import NotificationsPage from "./pages/NotificationsPage";
import NotesPage from "./pages/NotesPage";

import ProfileModal from "./components/ProfileModal";
import CalendarPage from "./pages/CalendarPage";
import { MOCK_USERS } from "./data/mockUsers";

import { todayPlus, isOverdue, defaultCourseImage } from "./constants/theme";
import { triggerTaskAssignmentEmail } from "./services/emailService";
import { userApi, taskApi, courseApi, commentApi, attachmentApi, notificationApi, noteApi, fetchWithFallback } from "./services/api";
import {
  INIT_COURSES,
  CATEGORIES,
  INIT_TASKS,
  INIT_COMMENTS,
  INIT_ATTACHMENTS,
  INIT_NOTIFICATIONS,
  INIT_NOTES
} from "./data/initialData";

const DEFAULT_USERS = [
  { userId: 99, firstName: "Sistem", lastName: "Yöneticisi", email: "admin@ogr.edu.tr", roleId: 1, roleName: "Admin" },
  ...MOCK_USERS
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("stss_theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("stss_theme")) {
        setIsDarkMode(e.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("stss_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("stss_theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const VALID_PAGES = ["panel", "gorevler", "takvim", "dersler", "bildirimler", "notlar"];
  const [page, setPageState] = useState(() => {
    const saved = localStorage.getItem("stss_page");
    return saved && VALID_PAGES.includes(saved) ? saved : "panel";
  });
  const setPage = (p) => {
    const valid = VALID_PAGES.includes(p) ? p : "panel";
    setPageState(valid);
    localStorage.setItem("stss_page", valid);
  };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [emailToast, setEmailToast] = useState(null);

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("stss_courses");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Course parse error", e);
      }
    }
    return INIT_COURSES;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("stss_tasks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Task parse error", e);
      }
    }
    return INIT_TASKS;
  });

  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem("stss_comments");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Comment parse error", e);
      }
    }
    return INIT_COMMENTS;
  });

  const [attachments, setAttachments] = useState(() => {
    const saved = localStorage.getItem("stss_attachments");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Attachment parse error", e);
      }
    }
    return INIT_ATTACHMENTS;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("stss_notes");
    return saved ? JSON.parse(saved) : INIT_NOTES;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("stss_all_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("User parse error", e);
      }
    }
    return DEFAULT_USERS;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("stss_notifications");
    return saved ? JSON.parse(saved) : INIT_NOTIFICATIONS;
  });


  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [filters, setFilters] = useState({ course: "all", category: "all", search: "" });

  const handleUpdateUser = async (updatedUserData) => {
    setCurrentUser(updatedUserData);
    localStorage.setItem("stss_user", JSON.stringify(updatedUserData));

    const idx = MOCK_USERS.findIndex((u) => u.userId === updatedUserData.userId);
    if (idx !== -1) {
      MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...updatedUserData };
    }

    setUsers((prevUsers) => {
      const updatedList = prevUsers.map((u) =>
        u.userId === updatedUserData.userId ? { ...u, ...updatedUserData } : u
      );
      localStorage.setItem("stss_all_users", JSON.stringify(updatedList));
      return updatedList;
    });

    try {
      await userApi.update(updatedUserData.userId, {
        firstName: updatedUserData.firstName,
        lastName: updatedUserData.lastName,
        email: updatedUserData.email,
        password: updatedUserData.password || "",
        roleId: updatedUserData.roleId || 2,
      });
    } catch (e) {
      console.warn("Kullanıcı profil güncelleme DB kaydı hatası:", e);
    }
  };

  const loadDataFromBackend = useCallback(async () => {
    try {
      const [backendTasks, backendCourses, backendComments, backendAttachments, backendUsers, backendNotifications, backendNotes] = await Promise.all([
        fetchWithFallback("/tasks", {}, null),
        fetchWithFallback("/courses", {}, null),
        fetchWithFallback("/comments", {}, null),
        fetchWithFallback("/attachments", {}, null),
        fetchWithFallback("/users", {}, null),
        fetchWithFallback("/notifications", {}, null),
        fetchWithFallback("/notes", {}, null),
      ]);

      if (backendUsers && backendUsers.length > 0) {
        const savedUsers = localStorage.getItem("stss_all_users");
        const localUsers = savedUsers ? JSON.parse(savedUsers) : [];

        const normalizedUsers = backendUsers.map((u) => ({
          ...u,
          roleName: u.roleName || (u.roleId === 1 ? "Admin" : "Öğrenci"),
        }));

        const backendUserIds = new Set(normalizedUsers.map((u) => u.userId));
        const onlyLocalUsers = localUsers.filter((u) => !backendUserIds.has(u.userId));
        const mergedUsers = [...normalizedUsers, ...onlyLocalUsers];

        setUsers(mergedUsers);
        localStorage.setItem("stss_all_users", JSON.stringify(mergedUsers));
      } else {
        const savedUsers = localStorage.getItem("stss_all_users");
        if (savedUsers) {
          try {
            const parsed = JSON.parse(savedUsers);
            if (Array.isArray(parsed) && parsed.length > 0) setUsers(parsed);
            else setUsers(DEFAULT_USERS);
          } catch {
            setUsers(DEFAULT_USERS);
          }
        } else {
          setUsers(DEFAULT_USERS);
        }
      }

      const rawTasks = Array.isArray(backendTasks) ? backendTasks : (backendTasks?.content || []);
      if (rawTasks && rawTasks.length > 0) {
        const savedTasks = localStorage.getItem("stss_tasks");
        const localTasks = savedTasks ? JSON.parse(savedTasks) : [];
        const localStatusMap = {};
        localTasks.forEach((t) => { localStatusMap[t.taskId] = t.status; });

        const loadedTasks = rawTasks.map((t) => ({
          taskId: t.taskId,
          title: t.title,
          description: t.description,
          dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
          status: localStatusMap[t.taskId] || t.status,
          priority: t.priority,
          courseId: t.courseId,
          categoryId: t.categoryId,
        }));

        const backendIds = new Set(loadedTasks.map((t) => t.taskId));
        const onlyLocal = localTasks.filter((t) => !backendIds.has(t.taskId));
        const merged = [...loadedTasks, ...onlyLocal];

        setTasks(merged);
        localStorage.setItem("stss_tasks", JSON.stringify(merged));
      } else {
        const savedTasks = localStorage.getItem("stss_tasks");
        setTasks(savedTasks ? JSON.parse(savedTasks) : INIT_TASKS);
      }

      if (backendCourses && backendCourses.length > 0) {
        const savedCourses = localStorage.getItem("stss_courses");
        const localCourses = savedCourses ? JSON.parse(savedCourses) : [];

        const loadedCourses = backendCourses.map((c) => ({
          courseId: c.courseId,
          courseName: c.courseName,
          imageUrl: c.imageUrl || defaultCourseImage(c.courseId, c.courseName),
          userId: c.userId,
        }));

        const backendCourseIds = new Set(loadedCourses.map((c) => c.courseId));
        const onlyLocalCourses = localCourses.filter((c) => !backendCourseIds.has(c.courseId));
        const mergedCourses = [...loadedCourses, ...onlyLocalCourses].map((c) => ({
          ...c,
          imageUrl: c.imageUrl || defaultCourseImage(c.courseId, c.courseName),
        }));

        setCourses(mergedCourses);
        localStorage.setItem("stss_courses", JSON.stringify(mergedCourses));
      } else {
        const savedCourses = localStorage.getItem("stss_courses");
        if (savedCourses) {
          try {
            const parsed = JSON.parse(savedCourses).map((c) => ({
              ...c,
              imageUrl: c.imageUrl || defaultCourseImage(c.courseId, c.courseName),
            }));
            setCourses(parsed);
          } catch {
            setCourses(INIT_COURSES);
          }
        } else {
          setCourses(INIT_COURSES);
        }
      }

      if (backendComments && backendComments.length > 0) {
        const savedComments = localStorage.getItem("stss_comments");
        const localComments = savedComments ? JSON.parse(savedComments) : [];

        const loadedComments = backendComments.map((cm) => ({
          commentId: cm.commentId,
          taskId: cm.taskId,
          userId: cm.userId,
          commentText: cm.commentText,
          createdDate: cm.createdDate ? cm.createdDate.slice(0, 10) : "",
        }));

        const backendCommentIds = new Set(loadedComments.map((cm) => cm.commentId));
        const onlyLocalComments = localComments.filter((cm) => !backendCommentIds.has(cm.commentId));
        const mergedComments = [...loadedComments, ...onlyLocalComments];

        setComments(mergedComments);
        localStorage.setItem("stss_comments", JSON.stringify(mergedComments));
      } else {
        const savedComments = localStorage.getItem("stss_comments");
        setComments(savedComments ? JSON.parse(savedComments) : INIT_COMMENTS);
      }

      if (backendAttachments && backendAttachments.length > 0) {
        const savedAttachments = localStorage.getItem("stss_attachments");
        const localAttachments = savedAttachments ? JSON.parse(savedAttachments) : [];

        const loadedAttachments = backendAttachments.map((a) => ({
          attachmentId: a.attachmentId,
          taskId: a.taskId,
          userId: a.userId,
          fileName: a.fileName,
          filePath: a.filePath,
          fileSize: a.fileSize,
          uploadDate: a.uploadDate ? a.uploadDate.slice(0, 10) : "",
        }));

        const backendAttachmentIds = new Set(loadedAttachments.map((a) => a.attachmentId));
        const onlyLocalAttachments = localAttachments.filter((a) => !backendAttachmentIds.has(a.attachmentId));
        const mergedAttachments = [...loadedAttachments, ...onlyLocalAttachments];

        setAttachments(mergedAttachments);
        localStorage.setItem("stss_attachments", JSON.stringify(mergedAttachments));
      } else {
        const savedAttachments = localStorage.getItem("stss_attachments");
        setAttachments(savedAttachments ? JSON.parse(savedAttachments) : INIT_ATTACHMENTS);
      }

      if (backendNotifications && backendNotifications.length > 0) {
        const saved = localStorage.getItem("stss_notifications");
        const local = saved ? JSON.parse(saved) : [];
        const localMap = {};
        local.forEach((n) => { localMap[n.notificationId] = n.isRead; });

        const loaded = backendNotifications.map((n) => ({
          notificationId: n.notificationId,
          userId: n.userId,
          message: (n.message || "").replace(/^(\?\?|\?|)+\s*/, "").replace(/^📢\s*/, ""),
          isRead: localMap[n.notificationId] !== undefined ? localMap[n.notificationId] : n.isRead,
          createdDate: n.createdDate ? n.createdDate.slice(0, 10) : "",
        }));

        setNotifications(loaded);
        localStorage.setItem("stss_notifications", JSON.stringify(loaded));
      } else {
        const saved = localStorage.getItem("stss_notifications");
        if (saved) {
          try {
            const parsed = JSON.parse(saved).map((n) => ({
              ...n,
              message: (n.message || "").replace(/^(\?\?|\?|)+\s*/, "").replace(/^📢\s*/, ""),
            }));
            setNotifications(parsed);
          } catch {
            setNotifications(INIT_NOTIFICATIONS);
          }
        } else {
          setNotifications(INIT_NOTIFICATIONS);
        }
      }

      if (backendNotes && backendNotes.length > 0) {
        const loadedNotes = backendNotes.map(n => ({
          ...n,
          createdDate: n.createdDate ? n.createdDate.slice(0, 10) : "",
        }));
        setNotes(loadedNotes);
        localStorage.setItem("stss_notes", JSON.stringify(loadedNotes));
      } else {
        const saved = localStorage.getItem("stss_notes");
        setNotes(saved ? JSON.parse(saved) : INIT_NOTES);
      }
    } catch (err) {
      console.warn("Backend veri yükleme uyarısı:", err);
    } finally {
      setDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("stss_user", JSON.stringify(currentUser));
      loadDataFromBackend();
    } else {
      localStorage.removeItem("stss_user");
    }
  }, [currentUser, loadDataFromBackend]);

  useEffect(() => {
    if (!currentUser || currentUser.roleId === 1) return;
    setNotifications((prev) => {
      const existingMessages = new Set(prev.map((n) => n.message));
      const overdueNotifs = tasks
        .filter((t) => isOverdue(t))
        .filter((t) => {
          const msg = `«gecikme»: "${t.title}" görevi teslim tarihini geçti!`;
          return !existingMessages.has(msg);
        })
        .map((t) => ({
          notificationId: Date.now() + t.taskId,
          userId: currentUser.userId,
          message: `«gecikme»: "${t.title}" görevi teslim tarihini geçti!`,
          isRead: false,
          createdDate: todayPlus(0),
        }));
      if (overdueNotifs.length === 0) return prev;
      const updated = [...overdueNotifs, ...prev];
      localStorage.setItem("stss_notifications", JSON.stringify(updated));
      
      overdueNotifs.forEach(n => {
        notificationApi.create({ message: n.message, userId: n.userId })
          .catch(e => console.warn("Otomatik bildirim DB kaydı hatası:", e));
      });

      return updated;
    });
  }, [tasks, currentUser]);

  const handleLogin = (user) => {
    setDataLoaded(true);
    setCurrentUser(user);
    const saved = localStorage.getItem("stss_page");
    setPage(saved && VALID_PAGES.includes(saved) ? saved : "panel");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedTaskId(null);
    setShowNewTask(false);
    localStorage.removeItem("stss_page");
    sessionStorage.removeItem("stss_jwt_token");
    sessionStorage.removeItem("stss_refresh_token");
  };

  const isResetPasswordRoute = window.location.pathname === "/reset-password";

  if (isResetPasswordRoute) {
    return <ResetPasswordPage />;
  }

  if (!currentUser) {
    return (
      <>
        <EmailToast email={emailToast} onClose={() => setEmailToast(null)} />
        <LoginPage onLogin={handleLogin} onEmailSent={setEmailToast} />
      </>
    );
  }

  const isAdmin = currentUser.roleId === 1;
  const nextId = (arr, key) => (arr.length ? Math.max(...arr.map((x) => x[key])) + 1 : 1);
  
  const currentUid = currentUser?.userId != null ? Number(currentUser.userId) : null;
  const userNotifications = isAdmin 
    ? notifications 
    : notifications.filter((n) => n.userId === null || n.userId === undefined || Number(n.userId) === currentUid);
    
  const unread = userNotifications.filter((n) => !n.isRead && !(isAdmin && (n.message || "").includes("DUYURU:"))).length;
  const selectedTask = tasks.find((t) => t.taskId === selectedTaskId);

  const handleStatusChange = async (taskId, status) => {
    setTasks((ts) => {
      const updated = ts.map((t) => (t.taskId === taskId ? { ...t, status } : t));
      localStorage.setItem("stss_tasks", JSON.stringify(updated));
      return updated;
    });
    const task = tasks.find((t) => t.taskId === taskId);
    if (task) {
      try {
        await taskApi.update(taskId, {
          title: task.title,
          description: task.description || "",
          dueDate: (task.dueDate || "").includes("T") ? task.dueDate : task.dueDate + "T00:00:00",
          status: status,
          priority: task.priority,
          courseId: task.courseId,
          categoryId: task.categoryId,
        });
      } catch (e) {
        console.warn("Görev durum DB güncelleme atlandı:", e);
      }
    }
  };

  const handleAddComment = (taskId, text) => {
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    const fullName = currentUser
      ? (currentUser.firstName && currentUser.lastName
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : currentUser.firstName || "Kullanıcı")
      : "Kullanıcı";

    setComments((prev) => {
      const maxId = prev.reduce((max, c) => {
        const id = Number(c.commentId);
        return !isNaN(id) && id > max ? id : max;
      }, 0);
      const newComment = {
        commentId: maxId + 1,
        taskId: Number(taskId),
        userId: currentUser.userId,
        userFullName: fullName,
        commentText: trimmed,
        createdDate: todayPlus(0),
      };
      const updated = [...prev, newComment];
      localStorage.setItem("stss_comments", JSON.stringify(updated));
      return updated;
    });

    commentApi.create({ commentText: trimmed, taskId: Number(taskId), userId: currentUser.userId })
      .catch((e) => console.warn("Yorum DB kaydı atlandı:", e));
  };

  const handleAddAttachment = (taskId, fileName, fileUrl) => {
    const fname = fileName || `dosya_${Math.floor(Math.random() * 900 + 100)}.pdf`;
    const filePath = fileUrl || `/uploads/${fname}`;

    setAttachments((prev) => {
      const maxId = prev.reduce((max, a) => {
        const id = Number(a.attachmentId);
        return !isNaN(id) && id > max ? id : max;
      }, 0);
      const newAttachment = {
        attachmentId: maxId + 1,
        taskId: Number(taskId),
        userId: currentUser.userId,
        fileName: fname,
        filePath,
        fileUrl: filePath,
        uploadDate: todayPlus(0),
      };
      const updated = [...prev, newAttachment];
      localStorage.setItem("stss_attachments", JSON.stringify(updated));
      return updated;
    });

    const backendPath = filePath.startsWith("data:") ? `/uploads/${fname}` : filePath;

    attachmentApi.create({ fileName: fname, filePath: backendPath, taskId: Number(taskId), userId: currentUser.userId })
      .then((created) => {
        if (created && created.attachmentId) {
          setAttachments((prev) => {
            const updated = prev.map((a) => {
              if (a.fileName === fname && Number(a.taskId) === Number(taskId) && Number(a.userId) === Number(currentUser.userId)) {
                return {
                  ...a,
                  attachmentId: created.attachmentId,
                  filePath: a.filePath.startsWith("data:") ? a.filePath : (created.filePath || a.filePath),
                  fileUrl: a.fileUrl.startsWith("data:") ? a.fileUrl : (created.filePath || a.fileUrl),
                };
              }
              return a;
            });
            localStorage.setItem("stss_attachments", JSON.stringify(updated));
            return updated;
          });
        }
      })
      .catch((e) => console.warn("Dosya DB kaydı atlandı:", e));

    const registeredStudents = (users || []).filter((u) => u.roleId === 2);
    const updatedAtts = [...attachments, { taskId: Number(taskId), userId: currentUser.userId }];
    const taskAtts = updatedAtts.filter((a) => a.taskId === Number(taskId));
    const submittedIds = new Set(taskAtts.map((a) => a.userId));
    const allSubmitted = registeredStudents.length > 0 && registeredStudents.every((s) => submittedIds.has(s.userId));

    if (allSubmitted) {
      handleStatusChange(taskId, "Tamamlandı");
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    const attObj = attachments.find((a) => a.attachmentId === attachmentId);
    const fileName = attObj ? attObj.fileName : "dosyayı";
    if (!window.confirm(`"${fileName}" isimli dosyayı veritabanından silmek istediğinize emin misiniz?`)) {
      return;
    }

    setAttachments((as) => {
      const updated = as.filter((a) => a.attachmentId !== attachmentId);
      localStorage.setItem("stss_attachments", JSON.stringify(updated));
      return updated;
    });

    try {
      await attachmentApi.delete(attachmentId);
    } catch (e) {
      console.warn("Dosya DB silme hatası:", e);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const taskObj = tasks.find((t) => t.taskId === taskId);
    const title = taskObj ? taskObj.title : "görevi";
    if (!window.confirm(`"${title}" isimli görevi veritabanından silmek istediğinize emin misiniz?`)) {
      return;
    }

    setTasks((ts) => {
      const updated = ts.filter((t) => t.taskId !== taskId);
      localStorage.setItem("stss_tasks", JSON.stringify(updated));
      return updated;
    });
    setSelectedTaskId(null);
    try {
      await taskApi.delete(taskId);
    } catch (e) {
      console.warn("Görev DB silme hatası:", e);
    }
  };

    const handleCreateTask = async (form) => {
    let created = null;
    try {
      created = await taskApi.create({
        title: form.title,
        description: form.description || "",
        dueDate: form.dueDate + "T00:00:00",
        status: "Bekliyor",
        priority: form.priority,
        courseId: form.courseId,
        categoryId: form.categoryId,
      });
    } catch (e) {
      console.warn("Görev DB ekleme atlandı:", e);
    }

    const newTaskObj = {
      taskId: created?.taskId || nextId(tasks, "taskId"),
      status: "Bekliyor",
      ...form,
    };

    setTasks((ts) => {
      const updated = [...ts, newTaskObj];
      localStorage.setItem("stss_tasks", JSON.stringify(updated));
      return updated;
    });
    setShowNewTask(false);

    const targetCourse = courses.find((c) => c.courseId === form.courseId);
    const studentUsers = (users || []).filter((u) => u.roleId === 2);

    let toastObj = null;
    if (studentUsers.length > 0) {
      for (const student of studentUsers) {
        const resObj = await triggerTaskAssignmentEmail(newTaskObj, targetCourse, student);
        if (!toastObj) toastObj = resObj;
      }
    } else {
      toastObj = await triggerTaskAssignmentEmail(newTaskObj, targetCourse, currentUser);
    }

    if (toastObj && !isAdmin) setEmailToast(toastObj);
  };

  const handleAddCourse = async (courseData, maybeImageUrl = "") => {
    let name = "";
    let img = "";
    if (typeof courseData === "object" && courseData !== null) {
      name = (courseData.courseName || "").trim();
      img = (courseData.imageUrl || "").trim();
    } else {
      name = (courseData || "").trim();
      img = (maybeImageUrl || "").trim();
    }
    if (!name) return;
    if (!img) {
      img = defaultCourseImage(Date.now(), name);
    }

    const targetUserId = currentUser?.userId || 1;
    const tempId = Date.now();

    const newCourse = { courseId: tempId, courseName: name, imageUrl: img, userId: targetUserId };

    setCourses((prev) => {
      const updated = [...prev, newCourse];
      localStorage.setItem("stss_courses", JSON.stringify(updated));
      return updated;
    });

    try {
      const created = await courseApi.create({
        courseName: name,
        imageUrl: img,
        userId: targetUserId > 0 ? targetUserId : 1,
      });
      if (created?.courseId) {
        setCourses((prev) => {
          const updated = prev.map((c) => (c.courseId === tempId ? { ...c, courseId: created.courseId, imageUrl: created.imageUrl || img } : c));
          localStorage.setItem("stss_courses", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.warn("Ders DB ekleme atlandı:", e);
    }
  };

  const handleEditCourse = async (courseId, newCourseName, maybeImageUrl = "") => {
    let name = "";
    let img = "";
    if (typeof newCourseName === "object" && newCourseName !== null) {
      name = (newCourseName.courseName || "").trim();
      img = (newCourseName.imageUrl || "").trim();
    } else {
      name = (newCourseName || "").trim();
      img = (maybeImageUrl || "").trim();
    }
    if (!name) return;

    setCourses((prev) => {
      const updated = prev.map((c) => (c.courseId === courseId ? { ...c, courseName: name, imageUrl: img || c.imageUrl } : c));
      localStorage.setItem("stss_courses", JSON.stringify(updated));
      return updated;
    });

    try {
      const current = courses.find((c) => c.courseId === courseId);
      const finalImg = img || current?.imageUrl || defaultCourseImage(courseId, name);
      await courseApi.update(courseId, {
        courseName: name,
        imageUrl: finalImg,
        userId: current?.userId || currentUser?.userId || 1,
      });
    } catch (e) {
      console.warn("Ders DB güncelleme hatası:", e);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const courseObj = courses.find((c) => c.courseId === courseId);
    const courseName = courseObj ? courseObj.courseName : "dersi";
    if (!window.confirm(`"${courseName}" dersini ve bu derse ait tüm görevleri veritabanından silmek istediğinize emin misiniz?`)) {
      return;
    }

    setCourses((cs) => {
      const updated = cs.filter((c) => c.courseId !== courseId);
      localStorage.setItem("stss_courses", JSON.stringify(updated));
      return updated;
    });
    setTasks((ts) => {
      const updated = ts.filter((t) => t.courseId !== courseId);
      localStorage.setItem("stss_tasks", JSON.stringify(updated));
      return updated;
    });
    try {
      await courseApi.delete(courseId);
    } catch (e) {
      console.warn("Ders DB silme hatası:", e);
    }
  };

  const handleSendNotification = async (message, targetUserId = null) => {
    const cleanText = (message || "").trim().replace(/^(\?\?|\?|)+\s*/, "").replace(/^📢\s*/, "");
    const formattedMessage = cleanText.startsWith("DUYURU:") ? cleanText : `DUYURU: ${cleanText}`;

    const msgObj = {
      message: formattedMessage,
      userId: targetUserId ? Number(targetUserId) : null,
    };
    
    try {
      const res = await notificationApi.create(msgObj);
      let newNotifs = [];

      if (Array.isArray(res) && res.length > 0) {
        newNotifs = res.map(r => ({
          notificationId: r.notificationId,
          userId: r.userId,
          message: r.message,
          isRead: false,
          createdDate: todayPlus(0),
        }));
      } else if (res && res.notificationId) {
        newNotifs = [{
          notificationId: res.notificationId,
          userId: res.userId,
          message: res.message,
          isRead: false,
          createdDate: todayPlus(0),
        }];
      } else {
        // Yerel fallback
        const targetIdNum = targetUserId ? Number(targetUserId) : null;
        if (targetIdNum) {
          newNotifs = [{
            notificationId: Date.now(),
            userId: targetIdNum,
            message: formattedMessage,
            isRead: false,
            createdDate: todayPlus(0),
          }];
        } else {
          const studentList = (users || []).filter(u => u.roleId === 2);
          if (studentList.length > 0) {
            newNotifs = studentList.map((s, idx) => ({
              notificationId: Date.now() + idx,
              userId: s.userId,
              message: formattedMessage,
              isRead: false,
              createdDate: todayPlus(0),
            }));
          } else {
            newNotifs = [{
              notificationId: Date.now(),
              userId: null,
              message: formattedMessage,
              isRead: false,
              createdDate: todayPlus(0),
            }];
          }
        }
      }

      setNotifications((ns) => {
        const updated = [...newNotifs, ...ns];
        localStorage.setItem("stss_notifications", JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.warn("Bildirim gönderme hatası:", e);
      const studentList = (users || []).filter(u => u.roleId === 2);
      const fallbackNotifs = targetUserId 
        ? [{ notificationId: Date.now(), userId: Number(targetUserId), message: formattedMessage, isRead: false, createdDate: todayPlus(0) }]
        : (studentList.length > 0 
            ? studentList.map((s, idx) => ({ notificationId: Date.now() + idx, userId: s.userId, message: formattedMessage, isRead: false, createdDate: todayPlus(0) }))
            : [{ notificationId: Date.now(), userId: null, message: formattedMessage, isRead: false, createdDate: todayPlus(0) }]);

      setNotifications((ns) => {
        const updated = [...fallbackNotifs, ...ns];
        localStorage.setItem("stss_notifications", JSON.stringify(updated));
        return updated;
      });
    }

    setEmailToast({
      id: Date.now(),
      type: "ANNOUNCEMENT",
      subject: targetUserId ? "Özel bildirim kullanıcıya iletildi!" : "Genel duyuru tüm öğrencilere iletildi!",
    });
  };

  const handleMarkRead = (id) => {
    setNotifications((ns) => {
      const updated = ns.map((n) => (Number(n.notificationId) === Number(id) ? { ...n, isRead: true } : n));
      localStorage.setItem("stss_notifications", JSON.stringify(updated));
      return updated;
    });
    notificationApi.markRead(id).catch(e => console.warn("Bildirim okundu işaretleme hatası", e));
  };

  const handleMarkAllRead = () => {
    const currentUserId = currentUser?.userId != null ? Number(currentUser.userId) : null;

    setNotifications((ns) => {
      const updated = ns.map((n) => {
        const notifUserId = n.userId != null ? Number(n.userId) : null;
        if (isAdmin || notifUserId === null || notifUserId === currentUserId) {
          return { ...n, isRead: true };
        }
        return n;
      });
      localStorage.setItem("stss_notifications", JSON.stringify(updated));
      return updated;
    });

    if (currentUserId) {
      notificationApi.markAllRead(currentUserId).catch(e => console.warn("Tüm bildirimleri okundu işaretleme hatası", e));
    }
  };

  const handleAddNote = async (noteData) => {
    const tempId = Date.now();
    const newNote = {
      noteId: tempId,
      ...noteData,
      createdDate: todayPlus(0),
    };
    setNotes(prev => {
      const updated = [newNote, ...prev];
      localStorage.setItem("stss_notes", JSON.stringify(updated));
      return updated;
    });

    try {
      const created = await noteApi.create(noteData);
      if (created && created.noteId) {
        setNotes(prev => {
          const updated = prev.map(n => n.noteId === tempId ? { ...n, noteId: created.noteId } : n);
          localStorage.setItem("stss_notes", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.warn("Not ekleme hatası", e);
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    setNotes(prev => {
      const updated = prev.map(n => n.noteId === id ? { ...n, ...noteData } : n);
      localStorage.setItem("stss_notes", JSON.stringify(updated));
      return updated;
    });
    try {
      await noteApi.update(id, noteData);
    } catch (e) {
      console.warn("Not güncelleme hatası", e);
    }
  };

  const handleDeleteNote = async (id) => {
    setNotes(prev => {
      const updated = prev.filter(n => n.noteId !== id);
      localStorage.setItem("stss_notes", JSON.stringify(updated));
      return updated;
    });
    try {
      await noteApi.delete(id);
    } catch (e) {
      console.warn("Not silme hatası", e);
    }
  };

  const handleTogglePin = async (id) => {
    setNotes(prev => {
      const updated = prev.map(n => {
        if (n.noteId === id) {
          return { ...n, isPinned: !n.isPinned };
        }
        return n;
      });
      localStorage.setItem("stss_notes", JSON.stringify(updated));
      return updated;
    });
    try {
      await noteApi.togglePin(id);
    } catch (e) {
      console.warn("Not pinleme hatası", e);
    }
  };

  const pageTitles = {
    panel: isAdmin ? "Yönetim Paneli" : "Panel",
    gorevler: isAdmin ? "Tüm Görevler" : "Görevler",
    takvim: "Takvim",
    dersler: isAdmin ? "Tüm Dersler" : "Derslerim",
    bildirimler: "Bildirimler",
    notlar: isAdmin ? "Tüm Notlar" : "Notlarım"
  };

  return (
    <div className="stss-root stss-app-bg min-h-screen flex relative">
      <EmailToast email={emailToast} onClose={() => setEmailToast(null)} />

      <Sidebar
        currentUser={currentUser}
        onLogout={handleLogout}
        page={page}
        setPage={setPage}
        unread={unread}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenProfile={() => setShowProfile(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1 min-w-0 relative z-10">
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#24262B]/10 dark:border-white/10 bg-[#F5F0E4]/90 dark:bg-[#181920]/90 backdrop-blur-md sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded text-[#111215] dark:text-white hover:bg-[#24262B]/8 dark:hover:bg-white/10">
            <MoreVertical size={18} />
          </button>
          <p className="stss-display font-semibold text-[15px] text-[#111215] dark:text-white">{pageTitles[page]}</p>
        </div>

        <div className="px-5 sm:px-8 py-8 max-w-6xl mx-auto">
          {page === "panel" && (
            isAdmin ? (
              <AdminDashboard
                tasks={tasks}
                courses={courses}
                users={users}
                setUsers={setUsers}
                attachments={attachments}
                onRefresh={loadDataFromBackend}
                onSendNotification={handleSendNotification}
              />
            ) : (
              <Dashboard currentUser={currentUser} tasks={tasks} courses={courses} attachments={attachments} setPage={setPage} />
            )
          )}
          {page === "gorevler" && (
            <TaskBoard
              tasks={tasks}
              courses={courses}
              categories={CATEGORIES}
              attachments={attachments}
              onOpen={setSelectedTaskId}
              onNew={() => setShowNewTask(true)}
              filters={filters}
              setFilters={setFilters}
              isAdmin={isAdmin}
              allUsers={users}
              currentUser={currentUser}
            />
          )}
          {page === "takvim" && (
            <CalendarPage
              tasks={tasks}
              courses={courses}
              onOpenTask={setSelectedTaskId}
              isAdmin={isAdmin}
              currentUser={currentUser}
              attachments={attachments}
            />
          )}
          {page === "dersler" && (
            <CoursesPage courses={courses} tasks={tasks} onAdd={handleAddCourse} onDelete={handleDeleteCourse} onEdit={handleEditCourse} isAdmin={isAdmin} />
          )}
          {page === "bildirimler" && (
            <NotificationsPage
              notifications={userNotifications}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
              isAdmin={isAdmin}
              users={users}
              onSendNotification={handleSendNotification}
            />
          )}
          {page === "notlar" && (
            <NotesPage
              notes={isAdmin ? notes : notes.filter((n) => n.userId === currentUser?.userId)}
              courses={courses}
              tasks={tasks}
              currentUser={currentUser}
              isAdmin={isAdmin}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              onTogglePin={handleTogglePin}
            />
          )}
        </div>
      </main>

      {/* MODALS */}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          course={courses.find((c) => c.courseId === selectedTask.courseId)}
          category={CATEGORIES.find((c) => c.categoryId === selectedTask.categoryId)}
          attachments={attachments.filter((a) => a.taskId === selectedTask.taskId)}
          comments={comments.filter((c) => c.taskId === selectedTask.taskId)}
          onClose={() => setSelectedTaskId(null)}
          onStatusChange={handleStatusChange}
          onAddComment={handleAddComment}
          onAddAttachment={handleAddAttachment}
          onDeleteAttachment={handleDeleteAttachment}
          isAdmin={isAdmin}
          allUsers={users}
          onDelete={handleDeleteTask}
          currentUser={currentUser}
        />
      )}

      {showNewTask && (
        <NewTaskModal
          courses={courses}
          categories={CATEGORIES}
          onClose={() => setShowNewTask(false)}
          onCreate={handleCreateTask}
        />
      )}

      {showProfile && (
        <ProfileModal
          currentUser={currentUser}
          onClose={() => setShowProfile(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
}
