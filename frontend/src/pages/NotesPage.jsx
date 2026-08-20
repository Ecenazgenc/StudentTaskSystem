import React, { useState, useMemo } from 'react';
import { Plus, Search, Pin, PinOff, Trash2, Edit3, Copy, Check, X, StickyNote, Filter, BookOpen, Tag as TagIcon, CheckSquare, Square } from 'lucide-react';

const COLORS = ['amber', 'emerald', 'indigo', 'rose', 'slate'];
const TAGS = ["Ders Notu", "Sınav Hazırlığı", "Ödev Notu", "Fikir", "Checklist"];

const colorClasses = {
  amber: "border-l-amber-500 bg-amber-50/90 dark:bg-amber-900/15 border-amber-300/70 dark:border-white/10",
  emerald: "border-l-emerald-500 bg-emerald-50/90 dark:bg-emerald-900/15 border-emerald-300/70 dark:border-white/10",
  indigo: "border-l-indigo-500 bg-indigo-50/90 dark:bg-indigo-900/15 border-indigo-300/70 dark:border-white/10",
  rose: "border-l-rose-500 bg-rose-50/90 dark:bg-rose-900/15 border-rose-300/70 dark:border-white/10",
  slate: "border-l-slate-500 bg-slate-50/90 dark:bg-slate-700/15 border-slate-300/70 dark:border-white/10",
};

const badgeColors = {
  amber: "bg-amber-200/80 text-amber-950 dark:bg-amber-900/40 dark:text-amber-300 font-extrabold",
  emerald: "bg-emerald-200/80 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-300 font-extrabold",
  indigo: "bg-indigo-200/80 text-indigo-950 dark:bg-indigo-900/40 dark:text-indigo-300 font-extrabold",
  rose: "bg-rose-200/80 text-rose-950 dark:bg-rose-900/40 dark:text-rose-300 font-extrabold",
  slate: "bg-slate-200/80 text-slate-950 dark:bg-slate-800/40 dark:text-slate-300 font-extrabold",
};

export default function NotesPage({ 
  notes, courses, tasks, currentUser, isAdmin,
  onAddNote, onUpdateNote, onDeleteNote, onTogglePin 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCourseId, setFormCourseId] = useState("");
  const [formTaskId, setFormTaskId] = useState("");
  const [formTag, setFormTag] = useState("Ders Notu");
  const [formColor, setFormColor] = useState("slate");

  const resetForm = () => {
    setFormTitle("");
    setFormContent("");
    setFormCourseId("");
    setFormTaskId("");
    setFormTag("Ders Notu");
    setFormColor("slate");
    setEditingNoteId(null);
    setIsFormOpen(false);
  };

  const handleEditNote = (note) => {
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCourseId(note.courseId || "");
    setFormTaskId(note.taskId || "");
    setFormTag(note.tag || "Ders Notu");
    setFormColor(note.color || "slate");
    setEditingNoteId(note.noteId);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formContent.trim()) return;
    
    const noteData = {
      title: formTitle,
      content: formContent,
      courseId: formCourseId ? parseInt(formCourseId) : null,
      taskId: formTaskId ? parseInt(formTaskId) : null,
      tag: formTag,
      color: formColor,
      userId: currentUser.userId,
    };

    if (editingNoteId) {
      onUpdateNote(editingNoteId, noteData);
    } else {
      noteData.isPinned = false;
      onAddNote(noteData);
    }
    resetForm();
  };

  const handleCopy = (note) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu notu silmek istediğinize emin misiniz?")) {
      onDeleteNote(id);
    }
  };

  const toggleChecklist = (note, lineIdx) => {
    const lines = note.content.split('\n');
    if (lines[lineIdx].startsWith('[ ]')) {
      lines[lineIdx] = lines[lineIdx].replace('[ ]', '[x]');
    } else if (lines[lineIdx].startsWith('[x]')) {
      lines[lineIdx] = lines[lineIdx].replace('[x]', '[ ]');
    }
    onUpdateNote(note.noteId, { ...note, content: lines.join('\n') });
  };

  const filteredNotes = useMemo(() => {
    return (notes || []).filter(note => {
      if (isAdmin) return true;
      return true;
    }).filter(note => {
      const matchSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCourse = selectedCourse === "all" || note.courseId === parseInt(selectedCourse);
      const matchTag = selectedTag === "all" || note.tag === selectedTag;
      return matchSearch && matchCourse && matchTag;
    });
  }, [notes, searchQuery, selectedCourse, selectedTag, isAdmin]);

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.isPinned);

  const renderNoteCard = (note) => {
    const course = courses.find(c => c.courseId === note.courseId);
    
    return (
      <div key={note.noteId} className={`stss-card rounded-xl border-2 p-4.5 shadow-sm hover:shadow-md transition-all border-l-[5px] group relative flex flex-col h-full ${colorClasses[note.color]}`}>
        {note.isPinned && (
          <div className="absolute -top-3 -right-2 bg-[#E2725B] text-white p-1.5 rounded-full shadow-md z-10">
            <Pin size={12} className="fill-current" />
          </div>
        )}
        
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-[#111215] dark:text-white text-base sm:text-lg pr-8 leading-snug">{note.title}</h3>
          
          <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-[#1C1D24]/90 p-1 rounded-lg backdrop-blur-sm border border-[#24262B]/15 dark:border-white/10 shadow-xs">
            <button onClick={() => onTogglePin(note.noteId)} className="p-1.5 text-[#111215]/70 hover:text-[#111215] dark:text-white/60 dark:hover:text-white cursor-pointer transition-colors" title={note.isPinned ? "Sabitlemeyi Kaldır" : "Sabitle"}>
              {note.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
            </button>
            <button onClick={() => handleCopy(note)} className="p-1.5 text-[#111215]/70 hover:text-[#3E8E7E] dark:text-white/60 dark:hover:text-[#3E8E7E] cursor-pointer transition-colors" title="Kopyala">
              <Copy size={14} />
            </button>
            <button onClick={() => handleEditNote(note)} className="p-1.5 text-[#111215]/70 hover:text-indigo-600 dark:text-white/60 dark:hover:text-indigo-400 cursor-pointer transition-colors" title="Düzenle">
              <Edit3 size={14} />
            </button>
            <button onClick={() => handleDelete(note.noteId)} className="p-1.5 text-[#111215]/70 hover:text-[#B8402C] dark:text-white/60 dark:hover:text-red-400 cursor-pointer transition-colors" title="Sil">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <span className={`inline-flex items-center gap-1 text-[10.5px] px-2.5 py-0.5 rounded-full ${badgeColors[note.color]}`}>
            <TagIcon size={11} />
            {note.tag}
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto stss-scroll pr-1 mb-4">
          {note.content.split('\n').map((line, idx) => {
            const isUnchecked = line.startsWith('[ ]');
            const isChecked = line.startsWith('[x]');
            
            if (isUnchecked || isChecked) {
              const text = line.substring(3).trim();
              return (
                <div key={idx} className="flex items-start gap-2 my-1.5">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleChecklist(note, idx); }}
                    className="mt-0.5 text-[#111215]/60 hover:text-[#3E8E7E] dark:text-white/60 dark:hover:text-[#3E8E7E] cursor-pointer"
                  >
                    {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                  <span className={`text-[13px] ${isChecked ? 'line-through text-[#111215]/40 dark:text-white/40' : 'text-[#111215] dark:text-white/90 font-medium'}`}>
                    {text}
                  </span>
                </div>
              );
            }
            return <p key={idx} className="text-[13px] text-[#111215]/90 dark:text-white/85 whitespace-pre-wrap mb-1 leading-relaxed font-normal">{line}</p>;
          })}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#24262B]/10 dark:border-white/10 text-[11px] text-[#111215]/75 dark:text-white/60 font-semibold">
          <div className="flex items-center gap-1 truncate">
            {course && (
              <>
                <BookOpen size={12} className="text-[#3E8E7E]" />
                <span className="truncate max-w-[140px] text-[#111215] dark:text-white font-bold">{course.courseName}</span>
              </>
            )}
          </div>
          <span className="stss-mono">{new Date(note.createdDate).toLocaleDateString("tr-TR")}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="stss-display text-[24px] font-bold text-[#111215] dark:text-white flex items-center gap-2">
            <StickyNote size={24} className="text-[#E2725B]" />
            Notlarım
          </h1>
          <p className="text-xs text-[#111215]/75 dark:text-white/65 mt-0.5 font-medium">
            Derslerinize ve görevlerinize özel hızlı notlar alın, yapılacak listeleri oluşturun
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#24262B] dark:bg-white text-[#F5F0E4] dark:text-[#121316] rounded-xl font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0 shadow-sm"
          >
            <Plus size={18} />
            Yeni Not
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-[#1C1D24] p-3 rounded-xl border-2 border-[#24262B]/15 dark:border-white/20 shadow-xs">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111215]/60 dark:text-white/40" />
          <input
            type="text"
            placeholder="Notlarda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#F5F0E4]/60 dark:bg-[#121316]/50 border-2 border-[#24262B]/15 dark:border-white/10 rounded-lg text-sm text-[#111215] dark:text-white font-medium focus:outline-none focus:border-[#3E8E7E] dark:focus:border-[#3E8E7E]"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2.5 bg-[#F5F0E4]/60 dark:bg-[#121316]/50 border-2 border-[#24262B]/15 dark:border-white/10 rounded-lg text-sm text-[#111215] dark:text-white font-semibold focus:outline-none focus:border-[#3E8E7E] dark:focus:border-[#3E8E7E]"
          >
            <option value="all">Tüm Dersler</option>
            {courses.map(c => (
              <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
            ))}
          </select>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2.5 bg-[#F5F0E4]/60 dark:bg-[#121316]/50 border-2 border-[#24262B]/15 dark:border-white/10 rounded-lg text-sm text-[#111215] dark:text-white font-semibold focus:outline-none focus:border-[#3E8E7E] dark:focus:border-[#3E8E7E]"
          >
            <option value="all">Tüm Etiketler</option>
            {TAGS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {isFormOpen && (
        <div className={`stss-card rounded-xl border-2 border-[#24262B]/20 dark:border-white/20 p-6 shadow-lg bg-white dark:bg-[#1C1D24] border-l-4 border-l-${formColor}-500`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#111215] dark:text-white flex items-center gap-2">
              {editingNoteId ? <Edit3 size={18} className="text-[#3E8E7E]" /> : <Plus size={18} className="text-[#3E8E7E]" />}
              {editingNoteId ? 'Notu Düzenle' : 'Yeni Not Ekle'}
            </h2>
            <button onClick={resetForm} className="p-1.5 text-[#111215]/60 hover:text-[#B8402C] dark:text-white/60 cursor-pointer rounded-lg hover:bg-[#24262B]/5">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Not Başlığı"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border-b-2 border-[#24262B]/20 dark:border-white/20 focus:border-[#3E8E7E] dark:focus:border-[#3E8E7E] outline-none text-lg font-bold text-[#111215] dark:text-white placeholder-[#111215]/40 dark:placeholder-white/40"
            />
            
            <textarea
              placeholder="Not içeriğinizi yazın... Checklist için [ ] kullanın"
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="w-full px-4 py-3 bg-[#F5F0E4]/40 dark:bg-[#121316]/40 border-2 border-[#24262B]/15 dark:border-white/15 rounded-xl focus:border-[#3E8E7E] dark:focus:border-[#3E8E7E] outline-none min-h-[150px] resize-y text-sm text-[#111215] dark:text-white font-medium placeholder-[#111215]/50 dark:placeholder-white/40 stss-scroll"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold text-[#111215] dark:text-white/80 mb-1.5 uppercase tracking-wider">Etiket</label>
                <select
                  value={formTag}
                  onChange={(e) => setFormTag(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-[#121316]/50 border-2 border-[#24262B]/15 dark:border-white/15 rounded-lg text-sm text-[#111215] dark:text-white font-semibold outline-none"
                >
                  {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-[11px] font-extrabold text-[#111215] dark:text-white/80 mb-1.5 uppercase tracking-wider">İlgili Ders (Opsiyonel)</label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-[#121316]/50 border-2 border-[#24262B]/15 dark:border-white/15 rounded-lg text-sm text-[#111215] dark:text-white font-semibold outline-none"
                >
                  <option value="">Seçiniz...</option>
                  {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-[11px] font-extrabold text-[#111215] dark:text-white/80 mb-1.5 uppercase tracking-wider">Renk</label>
                <div className="flex items-center gap-3 pt-1">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormColor(color)}
                      className={`w-7 h-7 rounded-full cursor-pointer transition-transform flex items-center justify-center ${formColor === color ? 'scale-110 ring-2 ring-offset-2 ring-[#24262B] dark:ring-white dark:ring-offset-[#1C1D24]' : 'hover:scale-110'}`}
                      style={{ 
                        backgroundColor: 
                          color === 'amber' ? '#fbbf24' : 
                          color === 'emerald' ? '#34d399' : 
                          color === 'indigo' ? '#818cf8' : 
                          color === 'rose' ? '#fb7185' : '#94a3b8' 
                      }}
                    >
                      {formColor === color && <Check size={14} className="text-white drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#24262B]/15 dark:border-white/10">
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-lg font-bold text-sm text-[#111215]/80 dark:text-white/70 hover:bg-[#24262B]/10 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={!formTitle.trim() || !formContent.trim()}
                className="px-5 py-2 bg-[#3E8E7E] text-white rounded-lg font-bold text-sm hover:bg-[#2E7A6B] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                <Check size={16} />
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {pinnedNotes.length > 0 && (
        <div>
          <h2 className="text-xs font-extrabold text-[#111215] dark:text-white/70 mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Pin size={14} className="text-[#E2725B]" /> Sabitlenmiş
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pinnedNotes.map(renderNoteCard)}
          </div>
        </div>
      )}

      <div>
        {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && (
          <h2 className="text-xs font-extrabold text-[#111215] dark:text-white/70 mb-3 mt-8 uppercase tracking-wider flex items-center gap-1.5">
            <StickyNote size={14} className="text-[#3E8E7E]" /> Diğer Notlar
          </h2>
        )}
        
        {unpinnedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {unpinnedNotes.map(renderNoteCard)}
          </div>
        ) : (
          pinnedNotes.length === 0 && (
            <div className="text-center py-16 bg-white/70 dark:bg-[#1C1D24]/50 rounded-2xl border-2 border-dashed border-[#24262B]/20 dark:border-white/10">
              <StickyNote size={48} className="mx-auto text-[#111215]/25 dark:text-white/15 mb-3" />
              <p className="text-sm text-[#111215]/75 dark:text-white/50 font-bold">Henüz not eklenmemiş</p>
              <p className="text-xs text-[#111215]/55 dark:text-white/40 mt-1 font-medium">Yeni bir not ekleyerek başlayın</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
