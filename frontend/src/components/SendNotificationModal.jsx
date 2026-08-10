import React, { useState } from "react";
import { X, Send, Bell } from "lucide-react";

export default function SendNotificationModal({ users = [], targetUser = null, onClose, onSend }) {
  const [message, setMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(targetUser ? targetUser.userId : "all");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const targetId = selectedUserId === "all" ? null : Number(selectedUserId);
    onSend(message.trim(), targetId);
    onClose();
  };

  const students = users.filter((u) => u.roleId === 2);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/80 px-0 sm:px-4">
      <div className="stss-card w-full sm:max-w-md rounded-t-xl sm:rounded-xl bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#24262B]/20 dark:border-white/20 p-6 max-h-[92vh] overflow-y-auto stss-scroll text-[#111215] dark:text-white shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#111215]/15 dark:border-white/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E2725B]/20 text-[#E2725B] flex items-center justify-center font-bold">
              <Bell size={18} />
            </div>
            <h3 className="stss-display text-[18px] font-bold text-[#111215] dark:text-white">
              Duyuru / Bildirim Gönder
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#24262B]/10 dark:hover:bg-white/10 text-[#111215] dark:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">
              ALICI KULLANICI
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#E2725B]/50"
            >
              <option value="all">📢 Tüm Öğrenciler (Genel Duyuru)</option>
              {students.map((u) => (
                <option key={u.userId} value={u.userId}>
                  👤 {u.firstName} {u.lastName} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-[#E5E7EB] block mb-1 uppercase">
              BİLDİRİM / DUYURU MESAJI
            </label>
            <textarea
              rows={4}
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Örn: Yarınki Veritabanı dersi saat 14:00'e alınmıştır. Lütfen zamanında katılınız."
              className="w-full px-3 py-2.5 rounded-lg border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#15161D] text-[#111215] dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#E2725B]/50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-[#EFE8D6] dark:bg-[#252732] border border-[#111215]/20 dark:border-white/20 text-[#111215] dark:text-white text-xs font-bold hover:bg-[#E5DDC7] dark:hover:bg-[#303342] transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!message.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#E2725B] text-white text-xs font-bold hover:bg-[#cf5f48] disabled:opacity-40 transition-all shadow-sm cursor-pointer"
            >
              <Send size={15} /> Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
