import React, { useState, useRef } from "react";
import { X, Tag, Calendar, Paperclip, FileText, Upload, MessageSquare, Send, Trash2, CheckCircle2, Clock, Download, Lock, Check, Award, Star } from "lucide-react";
import { tapeFor, fmtDate, PRIORITY_STYLE, CURRENT_USER } from "../constants/theme";

export default function TaskModal({ task, course, category, comments, attachments, onClose, onStatusChange, onAddComment, onAddAttachment, onDeleteAttachment, onDelete, isAdmin, allUsers, currentUser }) {
  const [draft, setDraft] = useState("");
  const fileInputRef = useRef(null);

  // --- NOTLANDIRMA STATE (Geri Bildirim) ---
  const [gradesMap, setGradesMap] = useState(() => {
    try {
      const saved = localStorage.getItem("stss_grades");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [inputGrade, setInputGrade] = useState("");
  const [inputFeedback, setInputFeedback] = useState("");
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState("");

  if (!task) return null;
  const tape = tapeFor(task.courseId);

  const registeredStudents = (allUsers || []).filter((u) => u.roleId === 2);
  const studentCount = registeredStudents.length;
  const submittedStudentIds = new Set((attachments || []).map((a) => a.userId));
  const allStudentsSubmitted = studentCount > 0 && registeredStudents.every((s) => submittedStudentIds.has(s.userId));

  const isDoneGlobally = allStudentsSubmitted;
  const isSubmitted = isAdmin
    ? isDoneGlobally
    : isDoneGlobally || (currentUser && submittedStudentIds.has(currentUser.userId));

  const gradeKey = `${task.taskId}_${currentUser?.userId}`;
  const currentStudentGrade = gradesMap[gradeKey];

  const handleSaveGrade = (targetStudentId) => {
    if (!targetStudentId) return;
    const key = `${task.taskId}_${targetStudentId}`;
    const updated = {
      ...gradesMap,
      [key]: {
        grade: Number(inputGrade) || 0,
        feedback: inputFeedback.trim(),
        gradedAt: new Date().toLocaleDateString("tr-TR"),
      },
    };
    setGradesMap(updated);
    localStorage.setItem("stss_grades", JSON.stringify(updated));
    alert("Ödev notu ve geri bildirim başarıyla kaydedildi! 🌟");
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileDataUrl = event.target.result;
        onAddAttachment(task.taskId, file.name, fileDataUrl);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const downloadAttachmentFile = (a) => {
    const fileData = a.filePath || a.fileUrl;
    if (!fileData || fileData === "#" || fileData.startsWith("/uploads/")) {
      const blob = new Blob([`Görev Defteri Ödev Dosyası İçeriği: ${a.fileName}\nTamamlandı.`], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = a.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }

    if (fileData.startsWith("data:")) {
      try {
        fetch(fileData)
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = a.fileName || "ödev_dosyası";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          });
      } catch (err) {
        console.error("Dosya indirme hatası:", err);
      }
    } else {
      const link = document.createElement("a");
      link.href = fileData;
      link.download = a.fileName || "ödev_dosyası";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getUserInfo = (uid) => {
    if (!uid) return { name: "Kullanıcı", isAdmin: false };
    if (uid === 99 || (currentUser && currentUser.userId === uid && isAdmin)) {
      return { name: "Sistem Yöneticisi", isAdmin: true };
    }
    const u = (allUsers || []).find((x) => x.userId === uid);
    if (u) {
      const isAdm = u.roleId === 1 || u.email === "admin@ogr.edu.tr" || u.userId === 99;
      return { name: `${u.firstName} ${u.lastName}`, isAdmin: isAdm };
    }
    return { name: "Kullanıcı", isAdmin: false };
  };

  const getUserName = (uid) => {
    const info = getUserInfo(uid);
    return info.isAdmin ? `${info.name} (Admin)` : info.name;
  };

  const statusColor = isSubmitted 
    ? { bg: "#E6F1EE", text: "#3E8E7E", icon: CheckCircle2 }
    : { bg: "#FFF3E0", text: "#E2725B", icon: Clock };
  
  const StatusIcon = statusColor.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 dark:bg-black/75 px-0 sm:px-4">
      <div className="stss-card relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto stss-scroll rounded-t-xl sm:rounded-lg bg-[#FFFDF8] dark:bg-[#1C1D24] dark:border-white/15 text-[#24262B] dark:text-white">
        <div className="h-2 w-full" style={{ background: tape.bg }} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-1">
            <span className="stss-mono text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: tape.tint, color: tape.bg }}>
              {course?.courseName || "Ders"}
            </span>
            <button onClick={onClose} className="p-1 rounded text-[#24262B]/40 dark:text-white/40 hover:text-[#24262B] dark:hover:text-white hover:bg-[#24262B]/5 dark:hover:bg-white/10 cursor-pointer">
              <X size={16} />
            </button>
          </div>
          <h2 className="stss-display text-[20px] font-bold mb-2 text-[#24262B] dark:text-white">{task.title}</h2>
          
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#24262B]/65 dark:text-white/65 mb-5">
            <span className="inline-flex items-center gap-1 font-medium">
              <Tag size={13} /> {category?.categoryName || "Kategori"}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Calendar size={13} /> {fmtDate(task.dueDate)}
            </span>
            <span>·</span>
            <span className="stss-mono text-[10px] px-2 py-0.5 rounded font-bold" style={{ color: (PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.Orta).color, background: "#24262B0F" }}>
              {task.priority} Öncelik
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[11px]" style={{ background: statusColor.bg, color: statusColor.text }}>
              <StatusIcon size={12} /> {isSubmitted ? "Tamamlandı" : task.status}
            </span>
          </div>

          {task.description && (
            <div className="mb-5 p-3.5 rounded-lg bg-[#24262B]/4 dark:bg-white/5 border border-[#24262B]/10 dark:border-white/10 text-[13px] leading-relaxed text-[#24262B]/85 dark:text-white/85">
              {task.description}
            </div>
          )}

          {/* GÖREV NOTU & GERİ BİLDİRİM BANNER (ÖĞRENCİ İÇİN) */}
          {!isAdmin && currentStudentGrade && (
            <div className="mb-5 p-3.5 rounded-xl border border-[#D9A441]/40 bg-[#FFF3E0] dark:bg-[#D9A441]/15 text-[#24262B] dark:text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#D9A441]">
                  <Award size={16} /> Öğretmen Değerlendirmesi
                </span>
                <span className="stss-mono text-xs font-extrabold bg-[#D9A441] text-white px-2.5 py-0.5 rounded">
                  {currentStudentGrade.grade} / 100
                </span>
              </div>
              {currentStudentGrade.feedback && (
                <p className="text-xs italic text-[#24262B]/80 dark:text-white/85 mt-1">
                  "{currentStudentGrade.feedback}"
                </p>
              )}
            </div>
          )}

          {/* NOTLANDIRMA ALANI (ADMIN İÇİN) */}
          {isAdmin && (
            <div className="mb-5 p-3.5 rounded-xl border border-[#24262B]/15 dark:border-white/15 bg-white dark:bg-[#22242F] space-y-2.5 shadow-xs">
              <p className="stss-mono text-[10.5px] text-[#24262B]/70 dark:text-white/70 font-bold flex items-center gap-1.5">
                <Star size={13} className="text-[#D9A441]" /> ÖDEV NOTLANDIRMA & GERİ BİLDİRİM
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={selectedStudentForGrading}
                  onChange={(e) => {
                    const sid = e.target.value;
                    setSelectedStudentForGrading(sid);
                    const existing = gradesMap[`${task.taskId}_${sid}`];
                    if (existing) {
                      setInputGrade(existing.grade);
                      setInputFeedback(existing.feedback || "");
                    } else {
                      setInputGrade("");
                      setInputFeedback("");
                    }
                  }}
                  className="px-2.5 py-1.5 rounded border border-[#24262B]/15 dark:border-white/15 text-xs bg-white dark:bg-[#1A1B22] text-[#24262B] dark:text-white"
                >
                  <option value="">Öğrenci Seçiniz...</option>
                  {registeredStudents.map((s) => (
                    <option key={s.userId} value={s.userId}>
                      {s.firstName} {s.lastName} {submittedStudentIds.has(s.userId) ? "✓ (Teslim Etti)" : ""}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Not (0-100)..."
                  value={inputGrade}
                  onChange={(e) => setInputGrade(e.target.value)}
                  className="px-2.5 py-1.5 rounded border border-[#24262B]/15 dark:border-white/15 text-xs bg-white dark:bg-[#1A1B22] text-[#24262B] dark:text-white"
                />
              </div>
              <textarea
                placeholder="Öğrenciye iletilecek değerlendirme notu..."
                value={inputFeedback}
                onChange={(e) => setInputFeedback(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-[#24262B]/15 dark:border-white/15 text-xs bg-white dark:bg-[#1A1B22] text-[#24262B] dark:text-white h-16 resize-none"
              />
              <button
                onClick={() => handleSaveGrade(selectedStudentForGrading)}
                className="w-full py-1.5 rounded bg-[#D9A441] hover:bg-[#c49237] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Notu ve Geri Bildirimi Kaydet
              </button>
            </div>
          )}

          {/* EKLER (DOSYALAR) ALANI */}
          <div className="mb-5">
            <p className="stss-mono text-[10.5px] text-[#24262B]/60 dark:text-white/60 mb-2 flex items-center gap-1.5 font-bold"><Paperclip size={12} /> EKLER VE YÜKLENEN DOSYALAR</p>
            <div className="space-y-2">
              {(isAdmin ? attachments : attachments.filter(a => a.userId === currentUser.userId)).map((a) => (
                <div key={a.attachmentId} className="flex flex-col p-2.5 rounded-md bg-[#24262B]/5 dark:bg-white/5 border border-[#24262B]/10 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={15} className="text-[#3E8E7E] shrink-0" />
                      <button 
                        onClick={() => downloadAttachmentFile(a)}
                        className="text-[12.5px] font-medium text-[#24262B] dark:text-white hover:text-[#3E8E7E] dark:hover:text-[#52B4A0] hover:underline truncate text-left flex items-center gap-1 cursor-pointer"
                        title="İndirmek için tıklayın"
                      >
                        {a.fileName}
                        <Download size={12} className="text-[#3E8E7E] shrink-0 ml-1" />
                      </button>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onDeleteAttachment(a.attachmentId)}
                        className="p-1 rounded text-[#B8402C]/80 hover:text-[#B8402C] hover:bg-[#B8402C]/10 transition-colors shrink-0 ml-2 cursor-pointer"
                        title="Dosyayı Sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <span className="stss-mono text-[10px] text-[#24262B]/50 dark:text-white/50 mt-1 pl-6">
                    {getUserName(a.userId)} · {fmtDate(a.uploadDate)}
                  </span>
                </div>
              ))}
              {(isAdmin ? attachments : attachments.filter(a => a.userId === currentUser.userId)).length === 0 && <p className="text-[12px] text-[#24262B]/40 dark:text-white/40 italic">Henüz dosya eklenmedi.</p>}
            </div>

            {/* Dosya Yükleme Butonu */}
            {(!isSubmitted || isAdmin) && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2.5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-[#3E8E7E]/40 bg-[#3E8E7E]/5 dark:bg-[#3E8E7E]/15 text-[#3E8E7E] dark:text-[#52B4A0] hover:bg-[#3E8E7E]/10 hover:border-[#3E8E7E]/60 transition-all cursor-pointer font-medium"
                >
                  <Upload size={16} />
                  <span className="text-[13px]">Ödev Dosyası Ekle</span>
                  <span className="text-[11px] opacity-70">(PDF, Word, vs.)</span>
                </button>
              </>
            )}
          </div>

          {/* YORUM ALANI */}
          <div className="mb-5">
            <p className="stss-mono text-[10.5px] text-[#24262B]/60 dark:text-white/60 mb-2 flex items-center gap-1.5 font-bold"><MessageSquare size={12} /> YORUMLAR ({comments.length})</p>
            <div className="space-y-2.5 mb-3">
              {comments.map((c) => {
                const info = getUserInfo(c.userId);
                return (
                  <div
                    key={c.commentId}
                    className={`p-3 rounded-lg border transition-all ${
                      info.isAdmin
                        ? "bg-[#FBEAE5]/50 dark:bg-[#E2725B]/15 border-[#E2725B]/30"
                        : "bg-[#24262B]/5 dark:bg-white/5 border-[#24262B]/10 dark:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12.5px] font-bold text-[#24262B] dark:text-white">{info.name}</span>
                        {info.isAdmin && (
                          <span className="stss-mono text-[9.5px] bg-[#E2725B] text-white px-1.5 py-0.2 rounded font-bold shadow-xs">
                            Yönetici (Admin)
                          </span>
                        )}
                      </div>
                      <span className="stss-mono text-[10px] text-[#24262B]/50 dark:text-white/50">{fmtDate(c.createdDate)}</span>
                    </div>
                    <p className="text-[12.5px] leading-snug text-[#24262B]/90 dark:text-white/90">{c.commentText}</p>
                  </div>
                );
              })}
              {comments.length === 0 && <p className="text-[12px] text-[#24262B]/40 dark:text-white/40 italic">Henüz yorum yok.</p>}
            </div>

            {(!isSubmitted || isAdmin) && (
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { onAddComment(task.taskId, draft.trim()); setDraft(""); } }}
                  placeholder={isAdmin ? "Yönetici olarak not veya yanıt yaz..." : "Bir not veya yorum yaz..."}
                  className="flex-1 px-3 py-2 rounded-md border border-[#24262B]/15 dark:border-white/15 text-[12.5px] bg-white dark:bg-[#1A1B22] text-[#24262B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
                />
                <button
                  onClick={() => { if (draft.trim()) { onAddComment(task.taskId, draft.trim()); setDraft(""); } }}
                  className="p-2 rounded-md bg-[#24262B] dark:bg-white text-[#F5F0E4] dark:text-[#121316] hover:bg-[#3a3d45] cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </div>
            )}
          </div>

          {/* ÖDEVİ GÖNDER VE TESLİM ET TUŞU (Sadece Öğrenci ve Teslim Edilmemişse) */}
          {!isAdmin && (
            !isSubmitted ? (
              <button
                onClick={() => onStatusChange(task.taskId, "Tamamlandı")}
                className="w-full mt-2 py-3 rounded-lg bg-[#3E8E7E] text-white font-semibold text-sm hover:bg-[#327366] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Check size={17} />
                <span>Ödevi Gönder ve Teslim Et</span>
              </button>
            ) : (
              <div className="w-full mt-2 py-2.5 rounded-lg bg-[#E6F1EE] dark:bg-[#3E8E7E]/20 text-[#3E8E7E] dark:text-[#52B4A0] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#3E8E7E]/30">
                <CheckCircle2 size={16} />
                <span>Ödev Teslim Edildi</span>
              </div>
            )
          )}

          {isAdmin && (
            <button
              onClick={() => onDelete(task.taskId)}
              className="mt-6 inline-flex items-center gap-1.5 text-[12px] text-[#B8402C] hover:underline font-semibold cursor-pointer"
            >
              <Trash2 size={13} /> Görevi sil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
