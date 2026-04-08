import React from 'react';
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  FileText,
  BarChart3,
  Timer as TimerIcon,
  Plus,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowLeft,
  Upload,
  Trash2,
  Code,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  TrendingUp,
  Lightbulb,
  Brain,
  Pin,
  Image as ImageIcon,
  Link as LinkIcon,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval,
  isToday,
  isTomorrow,
  parseISO,
  isBefore,
  startOfDay
} from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn } from './lib/utils';
import { Task, Note, View } from './types';

// --- Initial Data ---
const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Product Strategy Review', dueDate: new Date().toISOString().split('T')[0], startTime: '09:30 AM', priority: 'high', category: 'Work', completed: false },
  { id: '2', title: 'Deep Work: UI Architecture', dueDate: new Date().toISOString().split('T')[0], startTime: '02:00 PM', priority: 'medium', category: 'Study', completed: false },
  { id: '3', title: 'Evening Meditation Session', dueDate: new Date().toISOString().split('T')[0], startTime: '06:00 PM', priority: 'low', category: 'Personal', completed: false },
  { id: '4', title: 'Team Sync Call', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], startTime: '09:00 AM', priority: 'medium', category: 'Work', completed: false },
  { id: '5', title: 'Grocery Shopping', dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], startTime: '11:00 AM', priority: 'low', category: 'Personal', completed: false },
];

const INITIAL_NOTES: Note[] = [
  { id: '1', title: 'Quarterly Marketing Strategy', content: 'Key objectives for Q3 involve expanding our digital footprint across emerging platforms. Focus on video-first content and high-engagement social polls.', category: 'Projects', pinned: true, updatedAt: new Date().toISOString(), attachments: [{ type: 'image', count: 2 }, { type: 'link', count: 1 }] },
  { id: '2', title: 'Grocery List & Meal Prep', content: '- Almond milk (Unsweetened)\n- Fresh basil and organic tomatoes\n- Chicken breast (3lb)\n- Quinoa and Brown Rice mix\n- Avocado (get the soft ones)', category: 'Personal', pinned: false, updatedAt: new Date().toISOString(), attachments: [] },
  { id: '3', title: 'App Design Refactoring', content: 'The current navigation feels heavy on mobile. Consider shifting the TopAppBar items into a modal profile view. Use more surface-container-low for the background.', category: 'Projects', pinned: false, updatedAt: new Date().toISOString(), attachments: [{ type: 'link', count: 4 }] },
];

// --- Components ---

const BottomNav = ({ currentView, setView }: { currentView: View; setView: (v: View) => void }) => {
  const navItems = [
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
    { id: 'timer', label: 'Timer', icon: TimerIcon },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  ];
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-end px-4 pb-6 pt-2 h-24 bg-white/80 backdrop-blur-2xl z-50 rounded-t-[2.5rem] shadow-[0_-8px_40px_rgba(0,0,0,0.06)]">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        if (item.id === 'tasks') {
          return (
            <div key={item.id} className="relative -top-6">
              <button onClick={() => setView(item.id as View)} className={cn("w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300", isActive ? "bg-primary text-white scale-110" : "bg-white text-slate-400 hover:scale-105")}>
                <Icon className={cn("w-8 h-8", isActive && "fill-current")} />
              </button>
              <span className={cn("absolute -bottom-6 left-1/2 -translate-x-1/2 font-inter text-[10px] font-bold uppercase tracking-wider", isActive ? "text-primary" : "text-slate-400")}>{item.label}</span>
            </div>
          );
        }
        return (
          <button key={item.id} onClick={() => setView(item.id as View)} className={cn("flex flex-col items-center justify-center transition-all duration-300 scale-90 active:scale-100", isActive ? "text-primary" : "text-slate-400 hover:text-primary/70")}>
            <Icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
            <span className="font-inter text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const Header = ({ title, showSearch = true }: { title: string; showSearch?: boolean }) => (
  <header className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-primary-container flex items-center justify-center text-primary font-bold">MW</div>
      <h1 className="font-headline font-bold text-xl bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent">{title}</h1>
    </div>
    <div className="flex items-center gap-2">
      {showSearch && <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-200/50 transition-colors"><Search className="w-5 h-5" /></button>}
      <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-200/50 transition-colors"><Settings className="w-5 h-5" /></button>
    </div>
  </header>
);

// --- Task View ---
const TasksView = ({ tasks, onToggle, onDelete, onAddTask }: { tasks: Task[]; onToggle: (id: string) => void; onDelete: (id: string) => void; onAddTask: () => void }) => {
  const today = startOfDay(new Date());
  const todayTasks = tasks.filter(t => isSameDay(parseISO(t.dueDate), today));
  const upcomingTasks = tasks.filter(t => isBefore(today, parseISO(t.dueDate)));

  return (
    <div className="pt-24 pb-40 px-6 max-w-2xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">My Tasks</h2>
          <p className="text-on-surface-variant font-medium">Focus on what matters today.</p>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="font-headline text-xl font-bold text-on-surface">Today</h3>
          <span className="bg-primary-container/20 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">{todayTasks.filter(t => !t.completed).length}</span>
        </div>
        <div className="space-y-4">
          {todayTasks.length === 0 && <p className="text-on-surface-variant text-sm py-4 text-center">No tasks for today 🎉</p>}
          {todayTasks.map((task) => (
            <div key={task.id} className={cn("bg-surface-container-lowest p-5 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer", task.completed && "opacity-50")}>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <button onClick={() => onToggle(task.id)} className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors", task.completed ? "border-primary bg-primary" : "border-outline-variant group-hover:border-primary")}>
                    {task.completed && <Check className="w-4 h-4 text-white" />}
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={cn("font-headline font-bold text-on-surface", task.completed && "line-through")}>{task.title}</h4>
                    <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1"><Clock className="w-3 h-3" /> {task.startTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-on-surface-variant">{task.category}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <div className={cn("font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full", task.priority === 'high' ? "bg-tertiary-container/10 text-tertiary" : task.priority === 'medium' ? "bg-secondary-container/20 text-secondary" : "bg-primary-fixed/20 text-primary")}>{task.priority}</div>
                  </div>
                </div>
                <button onClick={() => onDelete(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-tertiary hover:text-tertiary/80 mt-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {upcomingTasks.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="font-headline text-xl font-bold text-on-surface">Upcoming</h3>
            <span className="bg-surface-container-highest text-on-surface-variant text-xs font-bold px-2.5 py-0.5 rounded-full">{upcomingTasks.length}</span>
          </div>
          <div className="space-y-4 opacity-80">
            {upcomingTasks.map((task) => (
              <div key={task.id} className={cn("bg-surface-container-lowest/60 border border-outline-variant/10 p-5 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer", task.completed && "opacity-50")}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <button onClick={() => onToggle(task.id)} className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors", task.completed ? "border-primary bg-primary" : "border-outline-variant group-hover:border-primary")}>
                      {task.completed && <Check className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={cn("font-headline font-bold text-on-surface", task.completed && "line-through")}>{task.title}</h4>
                      <span className="text-xs font-semibold text-on-surface-variant">{format(parseISO(task.dueDate), 'EEE, MMM d')}, {task.startTime}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-on-surface-variant">{task.category}</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <div className={cn("font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full", task.priority === 'high' ? "bg-tertiary-container/10 text-tertiary" : task.priority === 'medium' ? "bg-secondary-container/20 text-secondary" : "bg-primary-fixed/20 text-primary")}>{task.priority}</div>
                    </div>
                  </div>
                  <button onClick={() => onDelete(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-tertiary hover:text-tertiary/80 mt-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <button onClick={onAddTask} className="fixed bottom-28 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-transform z-50">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};

// --- Calendar View ---
const CalendarView = ({ tasks }: { tasks: Task[] }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDay, setSelectedDay] = React.useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
  });

  const tasksForDay = tasks.filter(t => isSameDay(parseISO(t.dueDate), selectedDay));

  return (
    <div className="pt-24 pb-40 px-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight leading-tight">Your Schedule</h2>
          <p className="text-on-surface-variant font-medium text-sm mt-1">Focus on today's priorities</p>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-6 mb-8 shadow-[0_4px_40px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline font-bold text-lg text-on-surface">{format(currentDate, 'MMMM yyyy')}</h3>
          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-surface-container-low transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-surface-container-low transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-y-4 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-[10px] font-bold uppercase tracking-widest text-outline">{day}</div>
          ))}
          {daysInMonth.map((day, idx) => {
            const isSelected = isSameDay(day, selectedDay);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const hasTasks = tasks.some(t => isSameDay(parseISO(t.dueDate), day));
            const isDayToday = isToday(day);
            return (
              <div key={idx} onClick={() => setSelectedDay(day)} className={cn("text-sm font-medium py-2 flex flex-col items-center justify-center relative cursor-pointer", !isCurrentMonth && "text-outline-variant", isCurrentMonth && "text-on-surface")}>
                <div className={cn("w-10 h-10 flex items-center justify-center rounded-full transition-all", isSelected && "bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20", !isSelected && isDayToday && "ring-2 ring-primary/30")}>
                  {format(day, 'd')}
                </div>
                {hasTasks && <div className="w-1 h-1 bg-secondary rounded-full mt-1 absolute bottom-1"></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-baseline justify-between mb-6">
        <h4 className="font-headline font-bold text-xl text-on-surface">{format(selectedDay, 'EEEE, MMM d')}</h4>
        <span className="text-xs font-bold text-outline uppercase tracking-widest">{tasksForDay.filter(t => !t.completed).length} Tasks</span>
      </div>
      <div className="space-y-4">
        {tasksForDay.length === 0 && <p className="text-on-surface-variant text-sm py-8 text-center">No tasks for this day</p>}
        {tasksForDay.map((task) => (
          <div key={task.id} className={cn("bg-surface-container-lowest p-5 rounded-xl flex items-start gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-l-4 transition-transform active:scale-[0.98]", task.priority === 'high' ? "border-tertiary" : task.priority === 'medium' ? "border-primary" : "border-outline")}>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className={cn("text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded", task.priority === 'high' ? "bg-tertiary-container text-on-tertiary" : task.priority === 'medium' ? "bg-primary-container text-on-primary" : "bg-surface-container-high text-on-surface-variant")}>{task.priority} Priority</span>
                <span className="text-xs font-medium text-outline flex items-center gap-1"><Clock className="w-3 h-3" /> {task.startTime}</span>
              </div>
              <h5 className={cn("font-headline font-bold text-on-surface text-lg", task.completed && "line-through opacity-50")}>{task.title}</h5>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full">
                  <span className={cn("w-2 h-2 rounded-full", task.category === 'Work' ? "bg-primary" : task.category === 'Study' ? "bg-secondary" : "bg-tertiary-fixed")}></span>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-tighter">{task.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Notes View ---
const NotesView = ({ notes, onTogglePin, onDelete, onAdd }: { notes: Note[]; onTogglePin: (id: string) => void; onDelete: (id: string) => void; onAdd: (title: string, content: string, category: string) => void }) => {
  const [filter, setFilter] = React.useState('All Notes');
  const [showCreate, setShowCreate] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newContent, setNewContent] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('Personal');

  const sorted = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const filtered = filter === 'All Notes' ? sorted : sorted.filter(n => n.category === filter);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    onAdd(newTitle.trim(), newContent.trim(), newCategory);
    setNewTitle(''); setNewContent(''); setNewCategory('Personal'); setShowCreate(false);
  };

  return (
    <div className="pt-24 pb-40 px-6 max-w-6xl mx-auto">
      <div className="mb-10">
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 no-scrollbar">
          {['All Notes', 'Projects', 'Personal'].map((cat, i) => (
            <button key={cat} onClick={() => setFilter(cat)} className={cn("px-5 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap", filter === cat ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest")}>{cat}</button>
          ))}
          <button onClick={() => setShowCreate(true)} className="px-5 py-2 rounded-full font-medium text-sm bg-secondary text-white flex items-center gap-1"><Plus className="w-4 h-4" /> New</button>
        </div>
      </div>

      {showCreate && (
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-md mb-8 border border-outline-variant/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline font-bold text-lg">New Note</h3>
            <button onClick={() => setShowCreate(false)} className="text-outline hover:text-on-surface"><X className="w-5 h-5" /></button>
          </div>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-surface-container-highest rounded-lg px-4 py-3 mb-3 border-none focus:ring-2 focus:ring-primary/20 font-body" placeholder="Note title..." />
          <textarea value={newContent} onChange={e => setNewContent(e.target.value)} className="w-full bg-surface-container-highest rounded-lg px-4 py-3 mb-3 border-none focus:ring-2 focus:ring-primary/20 font-body resize-none" rows={3} placeholder="Write your note..." />
          <div className="flex items-center gap-3">
            {['Personal', 'Projects'].map(c => (
              <button key={c} type="button" onClick={() => setNewCategory(c)} className={cn("px-4 py-1.5 rounded-full text-xs font-semibold", newCategory === c ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant")}>{c}</button>
            ))}
            <button onClick={handleCreate} className="ml-auto px-6 py-2 rounded-full bg-primary text-on-primary font-semibold text-sm">Save</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((note) => (
          <div key={note.id} className="group bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[220px] cursor-pointer">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-on-surface leading-tight">{note.title}</h3>
                <button onClick={() => onTogglePin(note.id)} className={cn("transition-colors", note.pinned ? "text-primary" : "text-outline-variant hover:text-primary")}><Pin className={cn("w-4 h-4", note.pinned && "fill-current")} /></button>
              </div>
              <p className="text-on-surface-variant text-sm line-clamp-4 leading-relaxed font-body">{note.content}</p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-surface-container">
              <div className="flex gap-2">
                {note.attachments?.map((att, i) => (
                  <div key={i} className={cn("flex items-center gap-1 px-2 py-1 rounded", att.type === 'image' ? "bg-primary-container/20 text-primary" : "bg-secondary-container/30 text-secondary")}>
                    {att.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                    {att.count > 0 && <span className="text-[10px] font-bold">{att.count}</span>}
                  </div>
                ))}
              </div>
              <button onClick={() => onDelete(note.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-tertiary"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Analytics View ---
const AnalyticsView = ({ tasks }: { tasks: Task[] }) => {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const byCategory = tasks.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + 1; return acc; }, {} as Record<string, number>);
  const pieData = Object.entries(byCategory).map(([name, value]) => ({ name, value, color: name === 'Work' ? '#0960ac' : name === 'Study' ? '#006e3d' : '#fb6969' }));
  const barData = [{ name: 'Total', value: total }, { name: 'Done', value: completed }, { name: 'Pending', value: total - completed }];

  return (
    <div className="pt-24 pb-40 px-6 max-w-7xl mx-auto">
      <section className="mb-10">
        <h1 className="text-4xl font-extrabold font-headline text-on-background mb-2 tracking-tight">Productivity Insights</h1>
        <p className="text-on-surface-variant font-body max-w-2xl">Your task overview at a glance.</p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between">
          <div><span className="text-xs font-semibold text-primary uppercase tracking-wider">Overview</span><h2 className="text-4xl font-extrabold font-headline mt-2 text-on-background">{completed} of {total} Tasks Done</h2></div>
          <div className="mt-8 flex items-center text-secondary font-bold"><TrendingUp className="w-5 h-5 mr-1" /><span>{rate}% completion rate</span></div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-center items-center text-center">
          <TimerIcon className="text-primary w-8 h-8 mb-2" /><div className="text-2xl font-bold font-headline">{total}</div><div className="text-sm text-on-surface-variant">Total Tasks</div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-center items-center text-center">
          <TrendingUp className="text-secondary w-8 h-8 mb-2" /><div className="text-2xl font-bold font-headline">{rate}%</div><div className="text-sm text-on-surface-variant">Completion</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl">
          <h3 className="text-xl font-bold font-headline mb-10">Task Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}><Bar dataKey="value" fill="#0960ac" radius={[8, 8, 0, 0]} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} /><Tooltip cursor={{ fill: '#eff4f7' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col">
          <h3 className="text-xl font-bold font-headline mb-8">By Category</h3>
          {pieData.length > 0 ? (
            <>
              <div className="flex-1 flex items-center justify-center relative mb-8">
                <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie></PieChart></ResponsiveContainer>
              </div>
              <div className="space-y-3">{pieData.map((item) => (<div key={item.name} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div><span className="font-medium">{item.name}</span></div><span className="text-on-surface-variant">{item.value}</span></div>))}</div>
            </>
          ) : <p className="text-on-surface-variant text-sm text-center py-8">Add tasks to see categories</p>}
        </div>
      </div>
    </div>
  );
};

// --- Timer View ---
const TimerView = () => {
  const [mode, setMode] = React.useState<'focus' | 'break'>('focus');
  const [totalSeconds, setTotalSeconds] = React.useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = React.useState(25 * 60);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    const dur = mode === 'focus' ? 25 * 60 : 5 * 60;
    setTotalSeconds(dur); setSecondsLeft(dur); setRunning(false);
  }, [mode]);

  React.useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft]);

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const circumference = 2 * Math.PI * 48;

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-6 pt-20 pb-40">
      <div className="mb-12 flex flex-col items-center">
        <div className="inline-flex bg-surface-container-low p-1.5 rounded-full mb-6">
          <button onClick={() => setMode('focus')} className={cn("px-6 py-2 rounded-full font-semibold text-sm transition-all", mode === 'focus' ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-container-high")}>Focus Session</button>
          <button onClick={() => setMode('break')} className={cn("px-6 py-2 rounded-full font-semibold text-sm transition-all", mode === 'break' ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-container-high")}>Short Break</button>
        </div>
        <p className="text-on-surface-variant text-sm font-medium tracking-wide uppercase">Stay in the flow</p>
      </div>
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center mb-12">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle className="text-surface-container-high" cx="50" cy="50" fill="transparent" r="48" stroke="currentColor" strokeWidth="4"></circle>
          <circle className="text-primary transition-all duration-1000" cx="50" cy="50" fill="transparent" r="48" stroke="currentColor" strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={circumference - (progress / 100) * circumference} style={{ strokeLinecap: 'round' }}></circle>
        </svg>
        <div className="flex flex-col items-center">
          <span className="text-7xl md:text-8xl font-extrabold text-on-surface font-headline tracking-tighter">{mins}:{secs}</span>
          <div className="mt-4 flex items-center gap-2 text-secondary font-medium">
            <span className={cn("w-2 h-2 rounded-full", running ? "bg-secondary animate-pulse" : "bg-outline")}></span>
            <span className="text-xs uppercase tracking-widest">{running ? (mode === 'focus' ? 'Focusing...' : 'Resting...') : 'Ready'}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-8 mb-16">
        <button onClick={() => { setSecondsLeft(totalSeconds); setRunning(false); }} className="w-14 h-14 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-90"><RotateCcw className="w-6 h-6" /></button>
        <button onClick={() => setRunning(r => !r)} className="h-20 w-20 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-xl shadow-primary/20 active:scale-95 transition-transform">
          {running ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 fill-current" />}
        </button>
        <button onClick={() => { setMode(mode === 'focus' ? 'break' : 'focus'); }} className="w-14 h-14 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-90"><SkipForward className="w-6 h-6" /></button>
      </div>
    </div>
  );
};

// --- Create Task View ---
const CreateTaskView = ({ onBack, onSave }: { onBack: () => void; onSave: (task: Omit<Task, 'id'>) => void }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = React.useState('09:00');
  const [category, setCategory] = React.useState<Task['category']>('Work');
  const [priority, setPriority] = React.useState<Task['priority']>('medium');

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${((h % 12) || 12).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description, dueDate, startTime: formatTime(startTime), priority, category, completed: false });
    onBack();
  };

  return (
    <div className="pt-24 pb-40 px-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-8">
        <header className="flex items-center gap-4">
          <button onClick={onBack} className="text-on-surface active:scale-95 transition-transform"><ArrowLeft className="w-6 h-6" /></button>
          <div><h2 className="font-headline font-extrabold text-4xl tracking-tight text-on-surface mb-2">Create New Task</h2><p className="text-on-surface-variant font-body">Define your goals and organize your workflow.</p></div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-8">
            <div className="space-y-2">
              <label className="font-label text-sm font-semibold text-on-surface-variant ml-1">Task Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-surface-container-highest rounded-xl px-4 py-4 text-lg font-body border-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant" placeholder="e.g. Design System Audit" type="text" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-sm font-semibold text-on-surface-variant ml-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-surface-container-highest rounded-xl px-4 py-4 font-body border-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant resize-none" placeholder="Provide context and key deliverables..." rows={5}></textarea>
            </div>
          </div>
          <div className="md:col-span-5 space-y-8">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              <div className="space-y-4">
                <label className="font-label text-sm font-semibold text-on-surface-variant">Due Date & Time</label>
                <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-lg"><CalendarIcon className="w-5 h-5 text-primary" /><input value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-transparent border-none p-0 text-sm font-medium w-full focus:ring-0" type="date" /></div>
                <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-lg"><Clock className="w-5 h-5 text-primary" /><input value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-transparent border-none p-0 text-sm font-medium w-full focus:ring-0" type="time" /></div>
              </div>
              <div className="space-y-4">
                <label className="font-label text-sm font-semibold text-on-surface-variant">Category</label>
                <div className="flex flex-wrap gap-2">
                  {(['Work', 'Study', 'Personal'] as const).map((cat) => (
                    <button key={cat} onClick={() => setCategory(cat)} className={cn("px-4 py-2 rounded-full font-semibold text-xs transition-colors", category === cat ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant")} type="button">{cat}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="font-label text-sm font-semibold text-on-surface-variant">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button key={p} onClick={() => setPriority(p)} className={cn("py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors", priority === p ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest")} type="button">{p}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button type="button" onClick={handleSave} className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg shadow-lg active:scale-95 transition-all">Save Task</button>
              <button onClick={onBack} className="w-full mt-4 py-3 text-on-surface-variant font-semibold text-sm hover:text-on-surface transition-colors" type="button">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [view, setView] = React.useState<View>('tasks');
  const [tasks, setTasks] = React.useState<Task[]>(INITIAL_TASKS);
  const [notes, setNotes] = React.useState<Note[]>(INITIAL_NOTES);

  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  const addTask = (task: Omit<Task, 'id'>) => setTasks(prev => [...prev, { ...task, id: Date.now().toString() }]);

  const togglePin = (id: string) => setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));
  const addNote = (title: string, content: string, category: string) => setNotes(prev => [...prev, { id: Date.now().toString(), title, content, category, pinned: false, updatedAt: new Date().toISOString(), attachments: [] }]);

  const renderView = () => {
    switch (view) {
      case 'tasks': return <TasksView tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onAddTask={() => setView('create-task')} />;
      case 'calendar': return <CalendarView tasks={tasks} />;
      case 'notes': return <NotesView notes={notes} onTogglePin={togglePin} onDelete={deleteNote} onAdd={addNote} />;
      case 'analytics': return <AnalyticsView tasks={tasks} />;
      case 'timer': return <TimerView />;
      case 'create-task': return <CreateTaskView onBack={() => setView('tasks')} onSave={addTask} />;
      default: return <TasksView tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onAddTask={() => setView('create-task')} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header title="Mindful Workspace" showSearch={view !== 'create-task'} />
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      {view !== 'create-task' && <BottomNav currentView={view} setView={setView} />}
    </div>
  );
}
