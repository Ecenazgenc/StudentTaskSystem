import React from "react";
import { Home, ClipboardList, BookOpen, Bell, GraduationCap, LogOut, ShieldCheck, CalendarDays, Sun, Moon, StickyNote } from "lucide-react";

export default function Sidebar({ currentUser, onLogout, page, setPage, unread, mobileOpen, setMobileOpen, onOpenProfile, isDarkMode, onToggleDarkMode }) {
  const isAdmin = currentUser?.roleId === 1;

  const items = isAdmin
    ? [
        { id: "panel", label: "Yönetim Paneli", icon: ShieldCheck },
        { id: "gorevler", label: "Tüm Görevler", icon: ClipboardList },
        { id: "takvim", label: "Takvim", icon: CalendarDays },
        { id: "dersler", label: "Tüm Dersler", icon: BookOpen },
        { id: "bildirimler", label: "Bildirimler", icon: Bell, badge: unread },
        { id: "notlar", label: "Tüm Notlar", icon: StickyNote },
      ]
    : [
        { id: "panel", label: "Panel", icon: Home },
        { id: "gorevler", label: "Görevler", icon: ClipboardList },
        { id: "takvim", label: "Takvim", icon: CalendarDays },
        { id: "dersler", label: "Derslerim", icon: BookOpen },
        { id: "bildirimler", label: "Bildirimler", icon: Bell, badge: unread },
        { id: "notlar", label: "Notlarım", icon: StickyNote },
      ];

  const firstLetter = currentUser?.firstName ? currentUser.firstName[0] : "U";
  const lastLetter = currentUser?.lastName ? currentUser.lastName[0] : "";

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full md:h-auto w-64 md:w-56 shrink-0 flex flex-col
          border-r border-[#24262B]/10 bg-[#EFE8D6] dark:bg-[#181920] dark:border-white/10 transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-2">
            <GraduationCap size={26} strokeWidth={1.75} className="text-[#24262B] dark:text-white" />
            <div>
              <p className="stss-display text-[17px] leading-tight font-semibold text-[#24262B] dark:text-white">Görev Defteri</p>
              <p className="stss-mono text-[10px] text-[#24262B]/55 dark:text-white/50">ÖĞRENCİ GÖREV TAKİP</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto stss-scroll">
          {items.map((it) => {
            const Icon = it.icon;
            const active = page === it.id;
            return (
              <button
                key={it.id}
                onClick={() => { setPage(it.id); setMobileOpen(false); }}
                className={`stss-tab w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] font-medium transition-colors
                  ${active ? "bg-[#24262B] text-[#F5F0E4] dark:bg-white dark:text-[#121316]" : "text-[#24262B]/75 dark:text-white/70 hover:bg-[#24262B]/8 dark:hover:bg-white/10"}`}
              >
                <Icon size={17} strokeWidth={1.75} />
                <span className="flex-1 text-left">{it.label}</span>
                {!!it.badge && (
                  <span className="stss-mono text-[10px] bg-[#E2725B] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {it.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-[#24262B]/10 dark:border-white/10 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onOpenProfile}
              className="flex-1 flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#24262B]/8 dark:hover:bg-white/10 transition-colors text-left group cursor-pointer"
              title="Profili Düzenle"
            >
              <div className={`w-8 h-8 rounded-full text-[#F5F0E4] flex items-center justify-center stss-display font-semibold text-xs shrink-0 ${
                isAdmin ? "bg-[#E2725B]" : "bg-[#24262B] dark:bg-[#3E8E7E]"
              }`}>
                {firstLetter}{lastLetter}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold truncate text-[#24262B] dark:text-white group-hover:text-[#3E8E7E]">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <span className={`stss-mono text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                  isAdmin ? "bg-[#E2725B]/20 text-[#E2725B]" : "bg-[#3E8E7E]/20 text-[#3E8E7E]"
                }`}>
                  {isAdmin ? "Yönetici" : "Öğrenci"}
                </span>
              </div>
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg border border-[#24262B]/15 dark:border-white/20 text-[#24262B]/75 dark:text-white/80 hover:bg-[#24262B]/10 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title={isDarkMode ? "Aydınlık Mod" : "Koyu Mod (Dark)"}
            >
              {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenProfile}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium text-[#24262B]/80 dark:text-white/80 hover:bg-[#24262B]/8 dark:hover:bg-white/10 border border-[#24262B]/20 dark:border-white/20 transition-colors"
            >
              Profilim
            </button>
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md text-xs font-medium text-[#B8402C] dark:text-red-400 hover:bg-[#B8402C]/10 border border-[#B8402C]/20 transition-colors shrink-0"
              title="Çıkış Yap"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
