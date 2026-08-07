import React, { useState, useEffect, useCallback } from "react";
import { MoreVertical } from "lucide-react";

import Sidebar from "./components/Sidebar";
import TaskBoard from "./components/TaskBoard";
import TaskModal from "./components/TaskModal";
import NewTaskModal from "./components/NewTaskModal";
import EmailToast from "./components/EmailToast";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CoursesPage from "./pages/CoursesPage";
import NotificationsPage from "./pages/NotificationsPage";

import ProfileModal from "./components/ProfileModal";
import { MOCK_USERS } from "./pages/LoginPage";

import { todayPlus } from "./constants/theme";
import { triggerTaskAssignmentEmail } from "./services/emailService";
import { userApi, taskApi, courseApi, commentApi, attachmentApi, fetchWithFallback } from "./services/api";
import {
  INIT_COURSES,
  CATEGORIES,
  INIT_TASKS,
  INIT_COMMENTS,
  INIT_ATTACHMENTS,
  INIT_NOTIFICATIONS
} from "./data/initialData";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("stss_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [page, setPageState] = useState(() => {
    return localStorage.getItem("stss_page") || "panel";
  });
  const setPage = (p) => {
    setPageState(p);
    localStorage.setItem("stss_page", p);
  };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [emailToast, setEmailToast] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("stss_all_users");
    return saved ? JSON.parse(saved) : MOCK_USERS;
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

    try {
      await userApi.update(updatedUserData.userId, {
        firstName: updatedUserData.firstName,
        lastName: updatedUserData.lastName,
        email: updatedUserData.email,
        password: updatedUserData.password,
        roleId: updatedUserData.roleId,
      });
    } catch (e) {
      console.warn("Kullanıcı profil güncelleme DB kaydı atlandı:", e);
    }
  };

  // Veritabanından verileri çek, backend kapalıysa mock data kullan
  const loadDataFromBackend = useCallback(async () => {
    const [backendTasks, backendCourses, backendComments, backendAttachments, backendUsers] = await Promise.all([
      fetchWithFallback("/tasks", {}, null),
      fetchWithFallback("/courses", {}, null),
      fetchWithFallback("/comments", {}, null),
      fetchWithFallback("/attachments", {}, null),
      fetchWithFallback("/users", {}, null),
    ]);

    if (backendUsers && backendUsers.length > 0) {
      setUsers(backendUsers);
      localStorage.setItem("stss_all_users", JSON.stringify(backendUsers));
    } else {
      const savedUsers = localStorage.getItem("stss_all_users");
      setUsers(savedUsers ? JSON.parse(savedUsers) : MOCK_USERS);
    }

    if (backendTasks && backendTasks.length > 0) {
      const loadedTasks = backendTasks.map((t) => ({
        taskId: t.taskId,
        title: t.title,
        description: t.description,
        dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
        status: t.status,
        priority: t.priority,
        courseId: t.courseId,
        categoryId: t.categoryId,
      }));
      setTasks(loadedTasks);
      localStorage.setItem("stss_tasks", JSON.stringify(loadedTasks));
    } else {
      const savedTasks = localStorage.getItem("stss_tasks");
      setTasks(savedTasks ? JSON.parse(savedTasks) : INIT_TASKS);
    }

    if (backendCourses && backendCourses.length > 0) {
      const loadedCourses = backendCourses.map((c) => ({
        courseId: c.courseId,
        courseName: c.courseName,
        userId: c.userId,
      }));
      setCourses(loadedCourses);
      localStorage.setItem("stss_courses", JSON.stringify(loadedCourses));
    } else {
      const savedCourses = localStorage.getItem("stss_courses");
      setCourses(savedCourses ? JSON.parse(savedCourses) : INIT_COURSES);
    }

    if (backendComments && backendComments.length > 0) {
      const loaded = backendComments.map((c) => ({
        commentId: c.commentId,
        taskId: c.taskId,
        userId: c.userId,
        commentText: c.commentText,
        createdDate: c.createdDate ? c.createdDate.slice(0, 10) : "",
      }));
      setComments(loaded);
      localStorage.setItem("stss_comments", JSON.stringify(loaded));
    } else {
      const saved = localStorage.getItem("stss_comments");
      setComments(saved ? JSON.parse(saved) : INIT_COMMENTS);
    }

    if (backendAttachments && backendAttachments.length > 0) {
      const loaded = backendAttachments.map((a) => ({
        attachmentId: a.attachmentId,
        taskId: a.taskId,
        userId: a.userId,
        fileName: a.fileName,
        filePath: a.filePath,
        fileUrl: a.filePath,
        uploadDate: a.uploadDate ? a.uploadDate.slice(0, 10) : "",
      }));
      setAttachments(loaded);
      localStorage.setItem("stss_attachments", JSON.stringify(loaded));
    } else {
      const saved = localStorage.getItem("stss_attachments");
      setAttachments(saved ? JSON.parse(saved) : INIT_ATTACHMENTS);
    }

    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("stss_user", JSON.stringify(currentUser));
      loadDataFromBackend();
    } else {
      localStorage.removeItem("stss_user");
      setDataLoaded(false);
    }
  }, [currentUser, loadDataFromBackend]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (!localStorage.getItem("stss_page")) setPage("panel");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedTaskId(null);
    setShowNewTask(false);
    localStorage.removeItem("stss_page");
  };

  if (!currentUser) {
    return (
      <>
        <EmailToast email={emailToast} onClose={() => setEmailToast(null)} />
        <LoginPage onLogin={handleLogin} onEmailSent={setEmailToast} />
      </>
    );
  }

  if (!dataLoaded) {
    return (
      <div className="stss-root min-h-screen flex items-center justify-center">
        <p className="stss-mono text-sm text-[#24262B]/50">Veriler yükleniyor...</p>
      </div>
    );
  }

  const isAdmin = currentUser.roleId === 1;
  const nextId = (arr, key) => (arr.length ? Math.max(...arr.map((x) => x[key])) + 1 : 1);
  const unread = notifications.filter((n) => !n.isRead).length;
  const selectedTask = tasks.find((t) => t.taskId === selectedTaskId);

  // --- GÖREV İŞLEMLERİ ---

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

  const handleAddComment = async (taskId, text) => {
    const newComment = {
      commentId: nextId(comments, "commentId"),
      taskId,
      userId: currentUser.userId,
      commentText: text,
      createdDate: todayPlus(0),
    };
    setComments((cs) => {
      const updated = [...cs, newComment];
      localStorage.setItem("stss_comments", JSON.stringify(updated));
      return updated;
    });

    try {
      await commentApi.create({ commentText: text, taskId, userId: currentUser.userId > 2 ? 1 : currentUser.userId });
    } catch (e) {
      console.warn("Yorum DB kaydı atlandı:", e);
    }
  };

  const handleAddAttachment = async (taskId, fileName, fileUrl) => {
    const fname = fileName || `dosya_${Math.floor(Math.random() * 900 + 100)}.pdf`;
    const filePath = fileUrl || `/uploads/${fname}`;

    const newAttachment = {
      attachmentId: nextId(attachments, "attachmentId"),
      taskId,
      userId: currentUser.userId,
      fileName: fname,
      filePath: filePath,
      fileUrl: filePath,
      uploadDate: todayPlus(0),
    };

    setAttachments((as) => {
      const updated = [...as, newAttachment];
      localStorage.setItem("stss_attachments", JSON.stringify(updated));
      return updated;
    });

    try {
      const created = await attachmentApi.create({
        fileName: fname,
        filePath: filePath,
        taskId: taskId,
        userId: currentUser.userId,
      });
      if (created?.attachmentId) {
        newAttachment.attachmentId = created.attachmentId;
      }
    } catch (e) {
      console.warn("Dosya DB kaydı atlandı:", e);
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
    const emailObj = await triggerTaskAssignmentEmail(newTaskObj, targetCourse, currentUser);
    setEmailToast(emailObj);
  };

  // --- DERS İŞLEMLERİ ---

  const handleAddCourse = async (courseName) => {
    let created = null;
    try {
      created = await courseApi.create({ courseName, userId: currentUser.userId });
    } catch (e) {
      console.warn("Ders DB ekleme atlandı:", e);
    }

    const newCourse = {
      courseId: created?.courseId || nextId(courses, "courseId"),
      courseName,
      userId: currentUser.userId,
    };

    setCourses((cs) => {
      const updated = [...cs, newCourse];
      localStorage.setItem("stss_courses", JSON.stringify(updated));
      return updated;
    });
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

  // --- BİLDİRİM İŞLEMLERİ ---

  const handleMarkRead = (id) => {
    setNotifications((ns) => {
      const updated = ns.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n));
      localStorage.setItem("stss_notifications", JSON.stringify(updated));
      return updated;
    });
  };

  const handleMarkAllRead = () => {
    setNotifications((ns) => {
      const updated = ns.map((n) => ({ ...n, isRead: true }));
      localStorage.setItem("stss_notifications", JSON.stringify(updated));
      return updated;
    });
  };

  const pageTitles = {
    panel: isAdmin ? "Admin Paneli" : "Panel",
    gorevler: isAdmin ? "Tüm Görevler" : "Görevler",
    dersler: isAdmin ? "Tüm Dersler" : "Derslerim",
    bildirimler: "Bildirimler"
  };

  return (
    <div className="stss-root min-h-screen flex relative">
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
      />

      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#24262B]/10 bg-[#F5F0E4] sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded hover:bg-[#24262B]/8">
            <MoreVertical size={18} />
          </button>
          <p className="stss-display font-semibold text-[15px]">{pageTitles[page]}</p>
        </div>

        <div className="px-5 sm:px-8 py-8 max-w-6xl mx-auto">
          {page === "panel" && (
            isAdmin ? (
              <AdminDashboard tasks={tasks} courses={courses} users={users} setUsers={setUsers} />
            ) : (
              <Dashboard currentUser={currentUser} tasks={tasks} courses={courses} setPage={setPage} />
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
            />
          )}
          {page === "dersler" && (
            <CoursesPage courses={courses} tasks={tasks} onAdd={handleAddCourse} onDelete={handleDeleteCourse} isAdmin={isAdmin} />
          )}
          {page === "bildirimler" && (
            <NotificationsPage
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
            />
          )}
        </div>
      </main>

      {/* MODALS */}
      {showProfile && (
        <ProfileModal
          user={currentUser}
          onClose={() => setShowProfile(false)}
          onSave={handleUpdateUser}
        />
      )}

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
