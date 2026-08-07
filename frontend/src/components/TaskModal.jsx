import React, { useState, useRef } from "react";
import { X, Tag, Calendar, Paperclip, FileText, Upload, MessageSquare, Send, Trash2, CheckCircle2, Clock, Download, Lock, Check } from "lucide-react";
import { tapeFor, fmtDate, PRIORITY_STYLE, CURRENT_USER } from "../constants/theme";

export default function TaskModal({ task, course, category, comments, attachments, onClose, onStatusChange, onAddComment, onAddAttachment, onDeleteAttachment, onDelete, isAdmin, allUsers, currentUser }) {
  const [draft, setDraft] = useState("");
  const fileInputRef = useRef(null);
  if (!task) return null;
  const tape = tapeFor(task.courseId);

  const isSubmitted = task.status === "Tamamlandı" || (!isAdmin && attachments.some(a => a.userId === currentUser.userId));

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

  const getUserName = (uid) => {
    if (!uid) return "Eski Kayıt (İsimsiz)";
    if (!allUsers) return "Kullanıcı";
    const u = allUsers.find(x => x.userId === uid);
    return u ? `${u.firstName} ${u.lastName}` : "Kullanıcı";
  };

  const statusColor = isSubmitted 
    ? { bg: "#E6F1EE", text: "#3E8E7E", icon: CheckCircle2 }
    : { bg: "#FFF3E0", text: "#E2725B", icon: Clock };
  
  const StatusIcon = statusColor.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
      <div className="stss-card relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto stss-scroll rounded-t-xl sm:rounded-lg bg-[#FFFDF8]">
        <div className="h-2 w-full" style={{ background: tape.bg }} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-1">
            <span className="stss-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: tape.tint, color: tape.bg }}>
              {course?.courseName || "Ders"}
            </span>
            <button onClick={onClose} className="p-1 rounded hover:bg-[#24262B]/8"><X size={17} /></button>
          </div>
          <h2 className="stss-display text-[21px] font-semibold mt-2 mb-2">{task.title}</h2>
          <p className="text-[13.5px] text-[#24262B]/70 leading-relaxed mb-4">{task.description}</p>

          <div className="flex flex-wrap items-center gap-2 mb-5 text-[12px]">
            <span className="inline-flex items-center gap-1 stss-mono px-2 py-1 rounded bg-[#24262B]/6">
              <Tag size={12} /> {category?.categoryName || "Kategori"}
            </span>
            <span className="inline-flex items-center gap-1 stss-mono px-2 py-1 rounded bg-[#24262B]/6">
              <Calendar size={12} /> {fmtDate(task.dueDate)}
            </span>
            <span className="inline-flex items-center gap-1 stss-mono px-2 py-1 rounded" style={{ color: (PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.Orta).color, background: "#24262B0F" }}>
              Öncelik: {task.priority}
            </span>

          </div>

          {/* DURUM BANNER */}
          {!isAdmin && (
            <div className="mb-5">
              <p className="stss-mono text-[10px] text-[#24262B]/50 mb-2">DURUM</p>
              <div className="flex items-center justify-between">
                <div 
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium"
                  style={{ background: statusColor.bg, color: statusColor.text }}
                >
                  <StatusIcon size={16} />
                  <span>{task.status}</span>
                </div>
              </div>

              {isSubmitted ? (
                <div className="mt-2.5 p-3 rounded-lg bg-[#E6F1EE] border border-[#3E8E7E]/30 text-[#3E8E7E] text-[12px] font-medium flex items-center gap-2">
                  <Lock size={15} />
                  <span>Bu ödev teslim edilmiştir. Yeniden düzenlenemez.</span>
                </div>
              ) : (
                <p className="text-[11px] text-[#24262B]/45 mt-1.5 italic">Dosya ve yorumlarınızı ekledikten sonra aşağıdaki "Ödevi Gönder" butonuna basınız.</p>
              )}
            </div>
          )}

          {/* DOSYA YÜKLEME VE LİSTELEME ALANI */}
          <div className="mb-5">
            <p className="stss-mono text-[10px] text-[#24262B]/50 mb-2 flex items-center gap-1.5"><Paperclip size={11} /> DOSYALAR ({attachments.length})</p>
            <div className="space-y-1.5">
              {(isAdmin ? attachments : attachments.filter(a => a.userId === currentUser.userId)).map((a) => (
                <div
                  key={a.attachmentId}
                  className="w-full flex flex-col gap-1 text-[12.5px] px-3 py-2.5 rounded-lg bg-[#24262B]/5 hover:bg-[#24262B]/10 transition-colors group"
                >
                  <div className="flex items-center gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => downloadAttachmentFile(a)}
                      className="flex-1 flex items-center gap-2 text-left min-w-0"
                    >
                      <FileText size={14} className="text-[#3E8E7E] shrink-0" />
                      <span className="truncate group-hover:text-[#3E8E7E] transition-colors font-medium">{a.fileName}</span>
                      <Download size={13} className="text-[#24262B]/40 group-hover:text-[#3E8E7E] shrink-0 transition-colors ml-auto" />
                    </button>
                    {(!isSubmitted || isAdmin) && (
                      <button
                        type="button"
                        onClick={() => onDeleteAttachment(a.attachmentId)}
                        className="p-1 rounded text-[#B8402C]/60 hover:text-[#B8402C] hover:bg-[#B8402C]/10 transition-colors shrink-0 ml-2"
                        title="Dosyayı Sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <span className="stss-mono text-[10px] text-[#24262B]/50 mt-1 pl-6">
                    {getUserName(a.userId)} · {fmtDate(a.uploadDate)}
                  </span>
                </div>
              ))}
              {(isAdmin ? attachments : attachments.filter(a => a.userId === currentUser.userId)).length === 0 && <p className="text-[12px] text-[#24262B]/40 italic">Henüz dosya eklenmedi.</p>}
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
                  className="mt-2.5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-[#3E8E7E]/30 bg-[#3E8E7E]/5 text-[#3E8E7E] hover:bg-[#3E8E7E]/10 hover:border-[#3E8E7E]/50 transition-all"
                >
                  <Upload size={16} />
                  <span className="text-[13px] font-medium">Ödev Dosyası Ekle</span>
                  <span className="text-[11px] opacity-60">(PDF, Word, vs.)</span>
                </button>
              </>
            )}
          </div>

          {/* YORUM ALANI */}
          <div className="mb-5">
            <p className="stss-mono text-[10px] text-[#24262B]/50 mb-2 flex items-center gap-1.5"><MessageSquare size={11} /> YORUMLAR ({comments.length})</p>
            <div className="space-y-2.5 mb-3">
              {comments.map((c) => (
                <div key={c.commentId} className="px-3 py-2 rounded-md bg-[#24262B]/5">
                  <p className="text-[12.5px] leading-snug">{c.commentText}</p>
                  <p className="stss-mono text-[10px] text-[#24262B]/40 mt-1">{getUserName(c.userId)} · {fmtDate(c.createdDate)}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="text-[12px] text-[#24262B]/40 italic">Henüz yorum yok.</p>}
            </div>

            {(!isSubmitted || isAdmin) && (
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { onAddComment(task.taskId, draft.trim()); setDraft(""); } }}
                  placeholder="Bir not veya yorum yaz..."
                  className="flex-1 px-3 py-2 rounded-md border border-[#24262B]/12 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#24262B]/20"
                />
                <button
                  onClick={() => { if (draft.trim()) { onAddComment(task.taskId, draft.trim()); setDraft(""); } }}
                  className="p-2 rounded-md bg-[#24262B] text-[#F5F0E4] hover:bg-[#3a3d45]"
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
                className="w-full mt-2 py-3 rounded-lg bg-[#3E8E7E] text-white font-medium text-sm hover:bg-[#327366] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Check size={17} />
                <span>Ödevi Gönder ve Teslim Et</span>
              </button>
            ) : (
              <div className="w-full mt-2 py-2.5 rounded-lg bg-[#E6F1EE] text-[#3E8E7E] font-medium text-xs flex items-center justify-center gap-1.5 border border-[#3E8E7E]/20">
                <CheckCircle2 size={16} />
                <span>Ödev Teslim Edildi</span>
              </div>
            )
          )}

          {isAdmin && (
            <button
              onClick={() => onDelete(task.taskId)}
              className="mt-6 inline-flex items-center gap-1.5 text-[12px] text-[#B8402C]/80 hover:text-[#B8402C]"
            >
              <Trash2 size={13} /> Görevi sil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
