import React, { useState } from "react";
import { Plus, Trash2, Edit3, BookOpen, Image as ImageIcon } from "lucide-react";
import { tapeFor, defaultCourseImage } from "../constants/theme";
import NewCourseModal from "../components/NewCourseModal";

function CoursesPage({ courses = [], tasks = [], onAdd, onDelete, onEdit, isAdmin }) {
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleCreateOrEdit = (courseData) => {
    if (editingCourse) {
      if (onEdit) {
        onEdit(editingCourse.courseId, courseData.courseName, courseData.imageUrl);
      }
      setEditingCourse(null);
    } else {
      if (onAdd) {
        onAdd(courseData);
      }
    }
  };

  return (
    <div>
      {showModal && (
        <NewCourseModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateOrEdit}
        />
      )}

      {editingCourse && (
        <NewCourseModal
          initialData={editingCourse}
          onClose={() => setEditingCourse(null)}
          onCreate={handleCreateOrEdit}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="stss-display text-[24px] font-bold text-[#111215] dark:text-white flex items-center gap-2">
            <BookOpen size={24} className="text-[#3E8E7E]" />
            {isAdmin ? "Tüm Dersler & Müfredat" : "Derslerim"}
          </h1>
          <p className="text-xs text-[#111215]/85 dark:text-white/70 mt-0.5 font-semibold">
            Derslerinizi ve ders kapak fotoğraflarını yönetin
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E2725B] hover:bg-[#cf5f48] text-white text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
          >
            <Plus size={16} /> Yeni Ders Ekle
          </button>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="stss-card rounded-2xl p-10 text-center bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#111215]/15 dark:border-white/15">
          <p className="text-sm text-[#111215]/80 dark:text-white/70 italic font-semibold">Henüz eklenmiş ders bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => {
            const tape = tapeFor(c.courseId);
            const courseImg = c.imageUrl || defaultCourseImage(c.courseId, c.courseName);
            const count = tasks.filter((t) => Number(t.courseId) === Number(c.courseId)).length;
            const open = tasks.filter((t) => Number(t.courseId) === Number(c.courseId) && t.status !== "Tamamlandı").length;

            return (
              <div
                key={c.courseId}
                className="stss-card group relative rounded-2xl overflow-hidden bg-[#FFFDF8] dark:bg-[#1C1D24] border-2 border-[#111215]/15 dark:border-white/15 shadow-sm transition-all hover:shadow-lg"
              >
                {/* Course Header Cover Image */}
                <div className="relative h-32 w-full overflow-hidden bg-[#24262B]">
                  <img
                    src={courseImg}
                    alt={c.courseName}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <span className="stss-tape" style={{ background: tape.bg }} />

                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-lg p-1 border border-white/20">
                      <button
                        type="button"
                        onClick={() => setEditingCourse(c)}
                        className="p-1 rounded text-white/90 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                        title="Dersi ve Fotoğrafı Düzenle"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(c.courseId)}
                        className="p-1 rounded text-red-300 hover:text-red-100 hover:bg-red-500/40 transition-colors cursor-pointer"
                        title="Dersi Sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-4 right-4">
                    <p className="stss-display font-bold text-[17px] text-white leading-tight drop-shadow-md truncate">
                      {c.courseName}
                    </p>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-[12px] font-bold text-[#111215] dark:text-white pt-1">
                    <span className="stss-mono bg-[#3E8E7E]/15 text-[#1E564B] dark:text-[#A4E0D5] px-2.5 py-1 rounded-lg border border-[#3E8E7E]/30">
                      {count} Toplam Görev
                    </span>
                    <span className="stss-mono bg-[#E2725B]/15 text-[#9A4613] dark:text-[#FDC5B7] px-2.5 py-1 rounded-lg border border-[#E2725B]/30">
                      {open} Aktif Görev
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default React.memo(CoursesPage);

