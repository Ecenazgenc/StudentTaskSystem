import React, { useEffect } from "react";
import { PartyPopper, X } from "lucide-react";

export default function EmailToast({ email, onClose }) {
  useEffect(() => {
    if (!email) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [email, onClose]);

  if (!email) return null;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-xs w-full">
      <div className="stss-card rounded-xl p-4 bg-[#FFFDF8] border border-[#3E8E7E]/30 shadow-xl relative overflow-hidden">
        <div className="h-1 bg-[#3E8E7E] absolute top-0 left-0 right-0" />
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3E8E7E]/15 text-[#3E8E7E] flex items-center justify-center shrink-0">
              <PartyPopper size={17} />
            </div>
            <p className="text-sm font-semibold text-[#24262B]">Hoş Geldiniz! 🎉</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#24262B]/40 hover:text-[#24262B] hover:bg-[#24262B]/5 shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
