import React, { useState } from "react";
import { Bell, Send } from "lucide-react";
import { fmtDate } from "../constants/theme";
import SendNotificationModal from "../components/SendNotificationModal";

export default function NotificationsPage({ notifications, onMarkRead, onMarkAllRead, onMarkAll, isAdmin, users = [], onSendNotification }) {
  const [showModal, setShowModal] = useState(false);
  const markAllFn = onMarkAllRead || onMarkAll;

  return (
    <div>
      {showModal && (
        <SendNotificationModal
          users={users}
          onClose={() => setShowModal(false)}
          onSend={(msg, targetId) => {
            if (onSendNotification) {
              onSendNotification(msg, targetId);
            }
          }}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="stss-display text-[24px] font-bold text-[#111215] dark:text-white">Bildirimler</h1>
          <p className="text-xs text-[#24262B]/80 dark:text-white/70 mt-0.5 font-semibold">Sistem duyurularını ve bildirimlerinizi görüntüleyin</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E2725B] text-white text-xs font-bold hover:bg-[#cf5f48] transition-colors shadow-sm cursor-pointer"
            >
              <Bell size={15} /> 📢 Duyuru / Bildirim Gönder
            </button>
          )}
          {markAllFn && (
            <button onClick={markAllFn} className="text-[12.5px] text-[#111215] dark:text-white/80 hover:text-[#3E8E7E] dark:hover:text-[#52B4A0] underline font-bold cursor-pointer">
              Tümünü okundu işaretle
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl space-y-2.5">
        {notifications.length === 0 && (
          <div className="stss-card rounded-xl p-8 text-center bg-[#FFFDF8] dark:bg-[#1C1D24] border border-[#24262B]/15 dark:border-white/15">
            <p className="text-sm text-[#24262B]/70 dark:text-white/70 italic font-semibold">Henüz bildirim yok.</p>
          </div>
        )}
        {notifications.map((n) => (
          <button
            key={n.notificationId}
            onClick={() => onMarkRead(n.notificationId)}
            className={`w-full text-left flex items-start gap-3 px-4.5 py-3.5 rounded-xl border transition-colors cursor-pointer
              ${n.isRead 
                ? "border-[#24262B]/15 dark:border-white/10 bg-[#FFFDF8]/70 dark:bg-[#1C1D24]/60" 
                : "border-2 border-[#E2725B]/40 dark:border-[#E2725B]/60 bg-[#FFFDF8] dark:bg-[#1C1D24] shadow-xs"}`}
          >
            <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${n.isRead ? "bg-transparent" : "bg-[#E2725B]"}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-[13.5px] leading-snug ${n.isRead ? "text-[#24262B]/80 dark:text-white/75 font-medium" : "text-[#111215] dark:text-white font-extrabold"}`}>{n.message}</p>
              <p className="stss-mono text-[11px] text-[#24262B]/70 dark:text-white/60 mt-1 font-semibold">{fmtDate(n.createdDate)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
