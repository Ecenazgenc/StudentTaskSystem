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
        {notifications.map((n) => {
          const rawMsg = n.message || "";
          const isAnnouncement = rawMsg.includes("DUYURU:");
          const isGrading = rawMsg.includes("DEĞERLENDİRME:");
          const cleanedMsg = rawMsg
            .replace(/^(\?\?|\?|)+\s*/, "")
            .replace(/^📢\s*/, "")
            .replace(/^DUYURU:\s*/i, "")
            .replace(/^DEĞERLENDİRME:\s*/i, "");

          return (
            <button
              key={n.notificationId}
              onClick={() => onMarkRead(n.notificationId)}
              className={`w-full text-left flex items-start gap-3.5 px-5 py-4 rounded-xl border-2 transition-all cursor-pointer ${
                n.isRead 
                  ? "border-[#24262B]/10 dark:border-white/10 bg-[#FFFDF8]/70 dark:bg-[#1C1D24]/60" 
                  : "border-[#E2725B]/50 dark:border-[#E2725B]/60 bg-[#FFFDF8] dark:bg-[#1C1D24] shadow-sm hover:border-[#E2725B]"
              }`}
            >
              <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${n.isRead ? "bg-transparent border border-[#111215]/20 dark:border-white/20" : "bg-[#E2725B] ring-4 ring-[#E2725B]/20"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {isAnnouncement && (
                    <span className="stss-mono text-[10px] bg-[#E2725B] text-white px-2 py-0.5 rounded font-extrabold shadow-xs">
                      DUYURU
                    </span>
                  )}
                  {isGrading && (
                    <span className="stss-mono text-[10px] bg-[#D9A441] text-white px-2 py-0.5 rounded font-extrabold shadow-xs">
                      NOTLANDIRMA
                    </span>
                  )}
                  <p className="stss-mono text-[11px] text-[#111215]/65 dark:text-white/60 font-semibold">{fmtDate(n.createdDate)}</p>
                </div>
                <p className={`text-[13.5px] leading-relaxed ${n.isRead ? "text-[#111215]/80 dark:text-white/75 font-normal" : "text-[#111215] dark:text-white font-bold"}`}>
                  {cleanedMsg}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
