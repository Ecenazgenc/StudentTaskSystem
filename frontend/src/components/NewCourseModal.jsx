import React, { useState } from "react";
import { X, BookOpen, Image as ImageIcon, Upload, Check } from "lucide-react";
import { COURSE_COVER_PRESETS, defaultCourseImage, tapeFor } from "../constants/theme";

export default function NewCourseModal({ onClose, onCreate, initialData = null }) {
  const [courseName, setCourseName] = useState(initialData?.courseName || "");
  const [selectedImage, setSelectedImage] = useState(
    initialData?.imageUrl || COURSE_COVER_PRESETS[0].url
  );
  const [customUrl, setCustomUrl] = useState("");
  const [useCustomUrl, setUseCustomUrl] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomUrlApply = () => {
    if (customUrl.trim()) {
      setSelectedImage(customUrl.trim());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    const finalImage = selectedImage || defaultCourseImage(Date.now(), courseName.trim());
    onCreate({
      courseName: courseName.trim(),
      imageUrl: finalImage,
    });
    onClose();
  };

  const tape = tapeFor(1);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 dark:bg-black/80 px-0 sm:px-4 backdrop-blur-xs">
      <div className="stss-card w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-[#FFFDF8] dark:bg-[#1C1D24] p-6 max-h-[92vh] overflow-y-auto stss-scroll border-2 border-[#24262B]/20 dark:border-white/20 text-[#111215] dark:text-white shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#111215]/15 dark:border-white/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3E8E7E]/15 text-[#1E564B] dark:text-[#A4E0D5] flex items-center justify-center font-bold">
              <BookOpen size={19} />
            </div>
            <div>
              <h3 className="stss-display text-[18px] font-bold text-[#111215] dark:text-white">
                {initialData ? "Dersi Düzenle" : "Yeni Ders Ekle"}
              </h3>
              <p className="text-[11px] text-[#111215]/70 dark:text-white/60 font-semibold">Ders adı ve kapak görselini belirleyin</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#24262B]/10 dark:hover:bg-white/10 text-[#111215] dark:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-white/90 block mb-1.5 uppercase">
              DERS ADI *
            </label>
            <input
              type="text"
              autoFocus
              value={courseName}
              onChange={(e) => {
                setCourseName(e.target.value);
                if (!initialData && !useCustomUrl && !selectedImage.startsWith("data:")) {
                  setSelectedImage(defaultCourseImage(1, e.target.value));
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#111215]/20 dark:border-white/20 text-[13.5px] text-[#111215] dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E8E7E] bg-white dark:bg-[#15161D]"
              placeholder="Örn: Mobil Programlama, Veritabanı Sistemleri..."
            />
          </div>

          {/* Photo Presets Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="stss-mono text-[11px] font-extrabold text-[#111215] dark:text-white/90 uppercase flex items-center gap-1.5">
                <ImageIcon size={14} className="text-[#3E8E7E]" />
                DERS KAPAK FOTOĞRAFI
              </label>
              <button
                type="button"
                onClick={() => setUseCustomUrl(!useCustomUrl)}
                className="text-[11px] text-[#3E8E7E] dark:text-[#52B4A0] font-bold hover:underline cursor-pointer"
              >
                {useCustomUrl ? "Hazır Fotoğraflardan Seç" : "Özel Link / Yükle"}
              </button>
            </div>

            {!useCustomUrl ? (
              <div className="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto stss-scroll p-1">
                {COURSE_COVER_PRESETS.map((preset) => {
                  const isSelected = selectedImage === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedImage(preset.url)}
                      className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer h-20 text-left ${
                        isSelected 
                          ? "border-[#3E8E7E] ring-3 ring-[#3E8E7E]/40 shadow-sm" 
                          : "border-[#111215]/15 dark:border-white/15 opacity-80 hover:opacity-100 hover:border-[#3E8E7E]/60"
                      }`}
                    >
                      <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-1.5">
                        <span className="text-[10px] text-white font-bold leading-tight truncate">
                          {preset.title}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4.5 h-4.5 rounded-full bg-[#3E8E7E] text-white flex items-center justify-center shadow-xs">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2.5 p-3 rounded-xl bg-[#24262B]/5 dark:bg-white/5 border border-[#111215]/15 dark:border-white/15">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="Görsel URL'si yapıştırın (https://...)"
                    className="flex-1 px-3 py-2 rounded-lg border border-[#111215]/20 dark:border-white/20 text-xs bg-white dark:bg-[#15161D] text-[#111215] dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleCustomUrlApply}
                    className="px-3 py-2 rounded-lg bg-[#3E8E7E] text-white text-xs font-bold hover:bg-[#337568] cursor-pointer"
                  >
                    Uygula
                  </button>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-[#111215]/10 dark:border-white/10">
                  <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#15161D] border border-dashed border-[#111215]/30 dark:border-white/30 text-xs font-bold text-[#111215] dark:text-white hover:border-[#3E8E7E] cursor-pointer">
                    <Upload size={14} />
                    <span>Bilgisayardan Fotoğraf Yükle</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Live Card Preview */}
          <div>
            <label className="stss-mono text-[10px] font-extrabold text-[#111215]/70 dark:text-white/70 block mb-1.5 uppercase">
              KART ÖNİZLEMESİ
            </label>
            <div className="relative rounded-xl overflow-hidden border-2 border-[#111215]/20 dark:border-white/20 bg-white dark:bg-[#1C1D24] shadow-sm">
              <div className="h-24 w-full relative overflow-hidden bg-[#24262B]">
                <img src={selectedImage} alt="Kapak" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="stss-tape" style={{ background: tape.bg }} />
                <div className="absolute bottom-2 left-3 right-3">
                  <p className="stss-display font-bold text-white text-[15px] drop-shadow-sm truncate">
                    {courseName || "Ders Başlığı"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-[#111215]/15 dark:border-white/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border-2 border-[#111215]/15 dark:border-white/20 text-xs font-bold text-[#111215] dark:text-white hover:bg-[#111215]/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!courseName.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#E2725B] text-white text-xs font-bold hover:bg-[#cf5f48] disabled:opacity-40 transition-all shadow-sm cursor-pointer"
            >
              {initialData ? "Değişiklikleri Kaydet" : "Ders Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

