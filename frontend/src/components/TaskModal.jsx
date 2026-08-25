import React, { useState, useRef } from "react";
import { X, Tag, Calendar, Paperclip, FileText, Upload, MessageSquare, Send, Trash2, CheckCircle2, Clock, Download, Lock, Check, Award, Star } from "lucide-react";
import { tapeFor, fmtDate, PRIORITY_STYLE, CURRENT_USER, daysUntil } from "../constants/theme";
import { notificationApi } from "../services/api";

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

  const handleSaveGrade = async (targetStudentId) => {
    if (!targetStudentId) return;
    const key = `${task.taskId}_${targetStudentId}`;
    const gradeVal = Number(inputGrade) || 0;
    const feedbackVal = inputFeedback.trim();

    const updated = {
      ...gradesMap,
      [key]: {
        grade: gradeVal,
        feedback: feedbackVal,
        gradedAt: new Date().toLocaleDateString("tr-TR"),
      },
    };
    setGradesMap(updated);
    localStorage.setItem("stss_grades", JSON.stringify(updated));

    try {
      let notifMsg = `DEĞERLENDİRME: "${task.title}" başlıklı ödeviniz notlandırıldı. Notunuz: ${gradeVal}/100.`;
      if (feedbackVal) {
        notifMsg += ` Geri bildirim: "${feedbackVal}"`;
      }

      await notificationApi.create({
        message: notifMsg,
        userId: Number(targetStudentId)
      });
    } catch(e) {
      console.warn("Bildirim gönderilemedi:", e);
    }

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
    
    // Base64 Data URL -> Binary Blob çevirici (PDF ve Görseller için tam uyumlu)
    const dataURLtoBlob = (dataurl) => {
      try {
        const arr = dataurl.split(',');
        if (arr.length < 2) return null;
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        
        let base64Str = arr[1].replace(/\s/g, '');
        while (base64Str.length % 4 !== 0) {
          base64Str += '=';
        }

        const bstr = atob(base64Str);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        // ISO 32000-1 PDF standardı uyarınca %PDF- imzası ilk 1024 bayt içinde yer alabilir
        const isPdfType = mime === 'application/pdf' || dataurl.includes('application/pdf') || (a.fileName && a.fileName.toLowerCase().endsWith('.pdf'));
        if (isPdfType) {
          const sample = String.fromCharCode(...u8arr.slice(0, Math.min(u8arr.length, 1024)));
          if (!sample.includes('%PDF-')) {
            console.warn("Geçersiz PDF verisi tespiti.");
            return null;
          }
          return new Blob([u8arr], { type: 'application/pdf' });
        }

        return new Blob([u8arr], { type: mime });
      } catch (err) {
        console.error("Base64 dönüşüm hatası:", err);
        return null;
      }
    };

    // Örnek dosyalarda geçerli PDF yapısı oluşturucu
    const createValidMockPDFBlob = (title) => {
      const content = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 75 >> stream
BT /F1 16 Tf 50 700 Td (Gorev Defteri Odev Dosyasi: ${title || 'Odev'}) Tj ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000262 00000 n 
0000000388 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
463
%%EOF`;
      return new Blob([content], { type: "application/pdf" });
    };

    let blob = null;

    if (fileData && fileData.startsWith("data:")) {
      blob = dataURLtoBlob(fileData);
    }

    if (!blob) {
      const isPdf = a.fileName && a.fileName.toLowerCase().endsWith(".pdf");
      if (isPdf) {
        blob = createValidMockPDFBlob(a.fileName);
      } else {
        blob = new Blob([`Görev Defteri Ödev Dosyası İçeriği: ${a.fileName}\nTamamlandı.`], { type: "text/plain;charset=utf-8" });
      }
    }

    const url = URL.createObjectURL(blob);
    const isImage = a.fileName && /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(a.fileName);

    if (isImage) {
      const win = window.open(url, "_blank");
      if (!win) {
        const link = document.createElement("a");
        link.href = url;
        link.download = a.fileName || "görsel_dosyası";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      // PDF ve diğer tüm belgeler için doğrudan güvenli dosya indirme (Chrome PDF extension blob hatasını önler)
      const link = document.createElement("a");
      link.href = url;
      link.download = a.fileName || "ödev_dosyası.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const getUserInfo = (uid, fallbackName = null) => {
    if (!uid && !fallbackName) return { name: "Kullanıcı", isAdmin: false };
    if (currentUser && currentUser.userId === uid) {
      const isAdm = currentUser.roleId === 1 || currentUser.email === "admin@ogr.edu.tr" || currentUser.userId === 99 || isAdmin;
      const fullName = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim();
      const displayName = isAdm ? (fullName && fullName !== "Sistem Yöneticisi" ? fullName : "Sistem Yöneticisi") : (fullName || "Kullanıcı");
      return { name: displayName, isAdmin: isAdm };
    }
    if (uid === 99) {
      return { name: "Sistem Yöneticisi", isAdmin: true };
    }
    const u = (allUsers || []).find((x) => x.userId === uid);
    if (u) {
      const isAdm = u.roleId === 1 || u.email === "admin@ogr.edu.tr" || u.userId === 99;
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
      const displayName = isAdm ? (fullName && fullName !== "Sistem Yöneticisi" ? fullName : "Sistem Yöneticisi") : (fullName || "Kullanıcı");
      return { name: displayName, isAdmin: isAdm };
    }
    if (fallbackName) {
      return { name: fallbackName, isAdmin: false };
    }
    return { name: "Kullanıcı", isAdmin: false };
  };

  const getUserName = (uid, fallbackName = null) => {
    const info = getUserInfo(uid, fallbackName);
    return info.isAdmin ? `${info.name} (Admin)` : info.name;
  };

  const isExpired = !isSubmitted && (task.status === "Tamamlandı" || (task.dueDate && daysUntil(task.dueDate) < 0));

  const statusColor = isSubmitted 
    ? { bg: "#E6F1EE", text: "#3E8E7E", icon: CheckCircle2 }
    : isExpired
    ? { bg: "#FBEAE5", text: "#B8402C", icon: Clock }
    : { bg: "#FFF3E0", text: "#9A4613", icon: Clock };
  
  const StatusIcon = statusColor.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 dark:bg-black/75 px-0 sm:px-4">
      <div className="stss-card relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto stss-scroll rounded-t-xl sm:rounded-lg bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/15 dark:border-white/15 text-[#24262B] dark:text-white">
        <div className="h-2 w-full" style={{ background: tape.bg }} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-1">
            <span className="stss-mono text-[10.5px] px-2 py-0.5 rounded font-extrabold" style={{ background: tape.tint, color: tape.text || tape.bg }}>
              {course?.courseName || "Ders"}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg text-[#111215]/60 dark:text-white/40 hover:text-[#111215] dark:hover:text-white hover:bg-[#24262B]/10 dark:hover:bg-white/10 cursor-pointer">
              <X size={18} />
            </button>
          </div>
          <h2 className="stss-display text-[22px] font-bold mb-2 text-[#111215] dark:text-white">{task.title}</h2>
          
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[#111215]/85 dark:text-white/75 mb-5 font-semibold">
            <span className="inline-flex items-center gap-1 font-bold">
              <Tag size={13} className="text-[#3E8E7E]" /> {category?.categoryName || "Kategori"}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 font-bold">
              <Calendar size={13} className="text-[#E2725B]" /> {fmtDate(task.dueDate)}
            </span>
            <span>·</span>
            <span className="stss-mono text-[10.5px] px-2 py-0.5 rounded font-extrabold bg-[#24262B]/[0.08] dark:bg-white/10" style={{ color: (PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.Orta).color }}>
              {task.priority} Öncelik
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-bold text-[11px]" style={{ background: statusColor.bg, color: statusColor.text }}>
              <StatusIcon size={12} /> {isSubmitted ? "Tamamlandı" : (task.dueDate && daysUntil(task.dueDate) < 0) ? "Süresi Bitti" : isExpired ? "Kapatıldı" : task.status}
            </span>
          </div>

          {task.description && (
            <div className="mb-5 p-4 rounded-xl bg-[#F5F0E4]/60 dark:bg-white/5 border border-[#24262B]/15 dark:border-white/10 text-[13.5px] leading-relaxed text-[#111215] dark:text-white font-normal">
              {task.description}
            </div>
          )}

          {/* GÖREV NOTU & GERİ BİLDİRİM BANNER (ÖĞRENCİ İÇİN) */}
          {!isAdmin && currentStudentGrade && (
            <div className="mb-5 p-4 rounded-xl border-2 border-[#D9A441]/50 bg-[#FFF3E0] dark:bg-[#D9A441]/15 text-[#111215] dark:text-white shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#9A6E18] dark:text-[#F3C262]">
                  <Award size={17} /> Öğretmen Değerlendirmesi
                </span>
                <span className="stss-mono text-xs font-extrabold bg-[#9A6E18] text-white px-2.5 py-0.5 rounded shadow-xs">
                  {currentStudentGrade.grade} / 100
                </span>
              </div>
              {currentStudentGrade.feedback && (
                <p className="text-xs italic text-[#111215]/90 dark:text-white/90 mt-1 font-medium">
                  "{currentStudentGrade.feedback}"
                </p>
              )}
            </div>
          )}

          {/* NOTLANDIRMA ALANI (ADMIN İÇİN) */}
          {isAdmin && (
            <div className="mb-5 p-4 rounded-xl border-2 border-[#24262B]/15 dark:border-white/15 bg-white dark:bg-[#22242F] space-y-3 shadow-xs">
              <p className="stss-mono text-[11px] text-[#111215] dark:text-white font-extrabold flex items-center gap-1.5">
                <Star size={14} className="text-[#D9A441]" /> ÖDEV NOTLANDIRMA & GERİ BİLDİRİM
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                  className="px-3 py-2 rounded-lg border-2 border-[#24262B]/15 dark:border-white/15 text-xs bg-white dark:bg-[#1A1B22] text-[#111215] dark:text-white font-semibold"
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
                  className="px-3 py-2 rounded-lg border-2 border-[#24262B]/15 dark:border-white/15 text-xs bg-white dark:bg-[#1A1B22] text-[#111215] dark:text-white font-semibold"
                />
              </div>
              <textarea
                placeholder="Öğrenciye iletilecek değerlendirme notu..."
                value={inputFeedback}
                onChange={(e) => setInputFeedback(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-[#24262B]/15 dark:border-white/15 text-xs bg-white dark:bg-[#1A1B22] text-[#111215] dark:text-white h-16 resize-none font-medium"
              />
              <button
                onClick={() => handleSaveGrade(selectedStudentForGrading)}
                className="w-full py-2 rounded-lg bg-[#9A6E18] hover:bg-[#7D5512] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Notu ve Geri Bildirimi Kaydet
              </button>
            </div>
          )}

          {/* EKLER (DOSYALAR) ALANI */}
          <div className="mb-5">
            <p className="stss-mono text-[11px] text-[#111215] dark:text-white mb-2 flex items-center gap-1.5 font-extrabold"><Paperclip size={13} /> EKLER VE YÜKLENEN DOSYALAR</p>
            <div className="space-y-2">
              {(isAdmin ? attachments : attachments.filter(a => a.userId === currentUser.userId)).map((a) => (
                <div key={a.attachmentId} className="flex flex-col p-3 rounded-lg bg-white dark:bg-white/5 border-2 border-[#24262B]/10 dark:border-white/10 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={16} className="text-[#3E8E7E] shrink-0" />
                      <button 
                        onClick={() => downloadAttachmentFile(a)}
                        className="text-[13px] font-bold text-[#111215] dark:text-white hover:text-[#3E8E7E] dark:hover:text-[#52B4A0] hover:underline truncate text-left flex items-center gap-1 cursor-pointer"
                        title="İndirmek için tıklayın"
                      >
                        {a.fileName}
                        <Download size={13} className="text-[#3E8E7E] shrink-0 ml-1" />
                      </button>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onDeleteAttachment(a.attachmentId)}
                        className="p-1 rounded text-[#B8402C] hover:bg-[#B8402C]/10 transition-colors shrink-0 ml-2 cursor-pointer font-bold"
                        title="Dosyayı Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <span className="stss-mono text-[10.5px] text-[#111215]/70 dark:text-white/50 mt-1 pl-6 font-semibold">
                    {getUserName(a.userId)} · {fmtDate(a.uploadDate)}
                  </span>
                </div>
              ))}
              {(isAdmin ? attachments : attachments.filter(a => a.userId === currentUser.userId)).length === 0 && <p className="text-[12.5px] text-[#111215]/60 dark:text-white/40 italic font-medium">Henüz dosya eklenmedi.</p>}
            </div>

            {/* Dosya Yükleme Butonu */}
            {((!isSubmitted && !isExpired) || isAdmin) && (
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
                  className="mt-2.5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-[#3E8E7E]/50 bg-[#3E8E7E]/10 dark:bg-[#3E8E7E]/15 text-[#1E564B] dark:text-[#A4E0D5] hover:bg-[#3E8E7E]/15 hover:border-[#3E8E7E]/70 transition-all cursor-pointer font-bold"
                >
                  <Upload size={16} />
                  <span className="text-[13px]">Ödev Dosyası Ekle</span>
                  <span className="text-[11px] opacity-80">(PDF, Word, vs.)</span>
                </button>
              </>
            )}
          </div>

          {/* YORUM ALANI */}
          <div className="mb-5">
            <p className="stss-mono text-[11px] text-[#111215] dark:text-white mb-2 flex items-center gap-1.5 font-extrabold"><MessageSquare size={13} /> YORUMLAR ({comments.length})</p>
            <div className="space-y-2.5 mb-3">
              {comments.map((c) => {
                const info = getUserInfo(c.userId, c.userFullName);
                return (
                  <div
                    key={c.commentId}
                    className={`p-3.5 rounded-lg border-2 transition-all ${
                      info.isAdmin
                        ? "bg-[#FBEAE5] dark:bg-[#E2725B]/15 border-[#E2725B]/40"
                        : "bg-white dark:bg-white/5 border-[#24262B]/10 dark:border-white/10 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12.5px] font-bold text-[#111215] dark:text-white">{info.name}</span>
                        {info.isAdmin && (
                          <span className="stss-mono text-[9.5px] bg-[#E2725B] text-white px-1.5 py-0.2 rounded font-extrabold shadow-xs">
                            Yönetici (Admin)
                          </span>
                        )}
                      </div>
                      <span className="stss-mono text-[10.5px] text-[#111215]/65 dark:text-white/50 font-semibold">{fmtDate(c.createdDate)}</span>
                    </div>
                    <p className="text-[13px] leading-snug text-[#111215] dark:text-white/90 font-normal">{c.commentText}</p>
                  </div>
                );
              })}
              {comments.length === 0 && <p className="text-[12.5px] text-[#111215]/60 dark:text-white/40 italic font-medium">Henüz yorum yok.</p>}
            </div>

            {((!isSubmitted && !isExpired) || isAdmin) && (
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { onAddComment(task.taskId, draft.trim()); setDraft(""); } }}
                  placeholder={isAdmin ? "Yönetici olarak not veya yanıt yaz..." : "Bir not veya yorum yaz..."}
                  className="flex-1 px-3.5 py-2.5 rounded-lg border-2 border-[#24262B]/20 dark:border-white/15 text-[13px] bg-white dark:bg-[#1A1B22] text-[#111215] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3E8E7E]"
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
            isSubmitted ? (
              <div className="w-full mt-2 py-2.5 rounded-lg bg-[#E6F1EE] dark:bg-[#3E8E7E]/20 text-[#3E8E7E] dark:text-[#52B4A0] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#3E8E7E]/30">
                <CheckCircle2 size={16} />
                <span>Ödev Teslim Edildi</span>
              </div>
            ) : isExpired ? (
              <div className="w-full mt-2 py-2.5 rounded-lg bg-[#FBEAE5] dark:bg-[#B8402C]/20 text-[#B8402C] dark:text-[#F8A092] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#B8402C]/30">
                <Clock size={16} />
                <span>Ödevin süresi dolmuştur, teslim edilemez</span>
              </div>
            ) : (
              <button
                onClick={() => onStatusChange(task.taskId, "Tamamlandı")}
                className="w-full mt-2 py-3 rounded-lg bg-[#3E8E7E] text-white font-semibold text-sm hover:bg-[#327366] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Check size={17} />
                <span>Ödevi Gönder ve Teslim Et</span>
              </button>
            )
          )}

          {isAdmin && (
            <div className="mt-6 flex items-center justify-between">
              {task.status !== "Tamamlandı" ? (
                <button
                  onClick={() => onStatusChange(task.taskId, "Tamamlandı")}
                  className="inline-flex items-center gap-1.5 text-[12.5px] px-3 py-1.5 rounded-md bg-[#24262B] text-white dark:bg-white dark:text-[#121316] font-semibold cursor-pointer hover:opacity-80"
                >
                  <Lock size={14} /> Görevi Sonlandır
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-[12.5px] text-[#24262B]/75 dark:text-white/60 font-semibold">
                  <Lock size={14} /> Görev Sonlandırıldı
                </div>
              )}
              
              <button
                onClick={() => onDelete(task.taskId)}
                className="inline-flex items-center gap-1.5 text-[12px] text-[#B8402C] hover:underline font-semibold cursor-pointer"
              >
                <Trash2 size={13} /> Görevi sil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
