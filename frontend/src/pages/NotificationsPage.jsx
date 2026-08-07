import React from "react";
import { fmtDate } from "../constants/theme";

export default function NotificationsPage({ notifications, onMarkRead, onMarkAll }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="stss-display text-[24px] font-semibold">Bildirimler</h1>
        <button onClick={onMarkAll} className="text-[12.5px] text-[#24262B]/55 hover:text-[#24262B]">Tümünü okundu işaretle</button>
      </div>
      <div className="max-w-xl space-y-2">
        {notifications.length === 0 && <p className="text-[13px] text-[#24262B]/45 italic">Henüz bildirim yok.</p>}
        {notifications.map((n) => (
          <button
            key={n.notificationId}
            onClick={() => onMarkRead(n.notificationId)}
            className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border transition-colors
              ${n.isRead ? "border-[#24262B]/8 bg-white/60" : "border-[#24262B]/15 bg-white"}`}
          >
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.isRead ? "bg-transparent" : "bg-[#E2725B]"}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-[13px] leading-snug ${n.isRead ? "text-[#24262B]/55" : "text-[#24262B] font-medium"}`}>{n.message}</p>
              <p className="stss-mono text-[10.5px] text-[#24262B]/40 mt-1">{fmtDate(n.createdDate)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
