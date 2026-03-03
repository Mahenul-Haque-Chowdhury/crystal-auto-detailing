'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

/* ────────────────────────────────────────────────────── */
/*  Types                                                */
/* ────────────────────────────────────────────────────── */

type DateTimePickerProps = {
  /** Current value in "YYYY-MM-DDTHH:mm" format (same as datetime-local) */
  value: string;
  /** Minimum selectable datetime in "YYYY-MM-DDTHH:mm" format */
  min?: string;
  /** Called with a "YYYY-MM-DDTHH:mm" string */
  onChange: (value: string) => void;
  id?: string;
  required?: boolean;
};

/* ────────────────────────────────────────────────────── */
/*  Helpers                                              */
/* ────────────────────────────────────────────────────── */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const pad = (n: number) => String(n).padStart(2, '0');

/** Parse "YYYY-MM-DDTHH:mm" into { year, month (0-based), day, hour, minute } */
function parseDTL(value: string) {
  if (!value) return null;
  const [datePart, timePart] = value.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [h, mi] = (timePart ?? '00:00').split(':').map(Number);
  return { year: y, month: m - 1, day: d, hour: h, minute: mi };
}

function toDTL(year: number, month: number, day: number, hour: number, minute: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}

function isSameDay(y1: number, m1: number, d1: number, y2: number, m2: number, d2: number) {
  return y1 === y2 && m1 === m2 && d1 === d2;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

/** Build the grid of day-cells for a calendar month (6 rows max) */
function buildCalendarGrid(year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);
  const cells: Array<{ day: number; inMonth: boolean; year: number; month: number }> = [];

  // Leading days from previous month
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrev = getDaysInMonth(prevYear, prevMonth);
  for (let i = firstDow - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, inMonth: false, year: prevYear, month: prevMonth });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, year, month });
  }

  // Trailing days from next month
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let trailDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: trailDay++, inMonth: false, year: nextYear, month: nextMonth });
  }

  return cells;
}

/* Generate time slots: every 30 minutes */
function generateTimeSlots() {
  const slots: Array<{ label: string; hour: number; minute: number }> = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hDisplay = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      slots.push({
        label: `${hDisplay}:${pad(m)} ${ampm}`,
        hour: h,
        minute: m,
      });
    }
  }
  return slots;
}
const TIME_SLOTS = generateTimeSlots();

/* ────────────────────────────────────────────────────── */
/*  Component                                            */
/* ────────────────────────────────────────────────────── */

export default function DateTimePicker({ value, min, onChange, id, required }: DateTimePickerProps) {
  const parsed = parseDTL(value);
  const minParsed = parseDTL(min ?? '');

  const now = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(parsed?.year ?? now.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? now.getMonth());
  const [isOpen, setIsOpen] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Selected date parts (before committing to value)
  const [selYear, setSelYear] = useState(parsed?.year ?? 0);
  const [selMonth, setSelMonth] = useState(parsed?.month ?? 0);
  const [selDay, setSelDay] = useState(parsed?.day ?? 0);
  const [selHour, setSelHour] = useState(parsed?.hour ?? 10);
  const [selMinute, setSelMinute] = useState(parsed?.minute ?? 0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeListRef = useRef<HTMLDivElement>(null);

  // Sync back from external value changes
  useEffect(() => {
    const p = parseDTL(value);
    if (p) {
      setSelYear(p.year);
      setSelMonth(p.month);
      setSelDay(p.day);
      setSelHour(p.hour);
      setSelMinute(p.minute);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowTimePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Scroll time list to selected time when opening time picker
  useEffect(() => {
    if (showTimePicker && timeListRef.current) {
      const selected = timeListRef.current.querySelector('[data-selected="true"]');
      if (selected) {
        selected.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  }, [showTimePicker]);

  const isBeforeMin = useCallback(
    (year: number, month: number, day: number, hour?: number, minute?: number) => {
      if (!minParsed) return false;
      const check = new Date(year, month, day, hour ?? 0, minute ?? 0);
      const minDate = new Date(minParsed.year, minParsed.month, minParsed.day, hour !== undefined ? minParsed.hour : 0, minute !== undefined ? minParsed.minute : 0);
      if (hour !== undefined) return check < minDate;
      // Day-level comparison: a day is disabled if the entire day is before the min date's day
      return check < new Date(minParsed.year, minParsed.month, minParsed.day);
    },
    [minParsed],
  );

  const isTimeSlotDisabled = useCallback(
    (hour: number, minute: number) => {
      if (!minParsed) return false;
      if (!selYear || !selDay) return false;
      if (selYear !== minParsed.year || selMonth !== minParsed.month || selDay !== minParsed.day) return false;
      // Same day as min: disable times before it
      return hour < minParsed.hour || (hour === minParsed.hour && minute < minParsed.minute);
    },
    [minParsed, selYear, selMonth, selDay],
  );

  const grid = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (year: number, month: number, day: number) => {
    if (isBeforeMin(year, month, day)) return;
    setSelYear(year);
    setSelMonth(month);
    setSelDay(day);
    // Auto-switch to time picker after selecting a date
    setShowTimePicker(true);
    // If we already have a time, emit the value
    if (selHour !== undefined) {
      onChange(toDTL(year, month, day, selHour, selMinute));
    }
  };

  const handleTimeSelect = (hour: number, minute: number) => {
    if (isTimeSlotDisabled(hour, minute)) return;
    setSelHour(hour);
    setSelMinute(minute);
    if (selYear && selDay) {
      onChange(toDTL(selYear, selMonth, selDay, hour, minute));
    }
    // Close after picking time
    setTimeout(() => {
      setIsOpen(false);
      setShowTimePicker(false);
    }, 150);
  };

  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  /* Format display value */
  const displayValue = useMemo(() => {
    if (!value) return '';
    const p = parseDTL(value);
    if (!p) return '';
    const monthName = MONTH_NAMES[p.month]?.slice(0, 3);
    const hDisplay = p.hour % 12 === 0 ? 12 : p.hour % 12;
    const ampm = p.hour < 12 ? 'AM' : 'PM';
    return `${monthName} ${p.day}, ${p.year}  ·  ${hDisplay}:${pad(p.minute)} ${ampm}`;
  }, [value]);

  // Prevent month navigation into the past
  const canGoPrev = useMemo(() => {
    if (!minParsed) return true;
    if (viewYear > minParsed.year) return true;
    if (viewYear === minParsed.year && viewMonth > minParsed.month) return true;
    return false;
  }, [viewYear, viewMonth, minParsed]);

  return (
    <div ref={containerRef} className="relative" id={id}>
      {/* Hidden native input for form required validation */}
      <input
        type="text"
        value={value}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-0 w-0 opacity-0"
        onChange={() => {}}
      />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((o) => !o);
          if (!isOpen) setShowTimePicker(false);
        }}
        className={[
          'flex h-10 w-full items-center gap-2 rounded-lg border bg-transparent px-3 text-left text-sm outline-none transition',
          value
            ? 'border-gold-400/20 text-slate-100 focus:border-gold-400/45'
            : 'border-gold-400/20 text-slate-500 focus:border-gold-400/45',
        ].join(' ')}
      >
        <span className="flex-1 truncate">{displayValue || 'Pick a date & time'}</span>
        <Clock className="h-4 w-4 shrink-0 text-gold-300/80" aria-hidden="true" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-[300px] overflow-hidden rounded-xl border border-gold-400/20 bg-[#0a0d18]/95 shadow-2xl shadow-black/60 backdrop-blur-xl">
          {/* Tabs: Calendar / Time */}
          <div className="flex border-b border-gold-400/10">
            <button
              type="button"
              onClick={() => setShowTimePicker(false)}
              className={[
                'flex-1 py-2.5 text-center text-xs font-semibold uppercase tracking-widest transition',
                !showTimePicker
                  ? 'border-b-2 border-gold-400 text-gold-300'
                  : 'text-slate-400 hover:text-slate-200',
              ].join(' ')}
            >
              Date
            </button>
            <button
              type="button"
              onClick={() => setShowTimePicker(true)}
              className={[
                'flex-1 py-2.5 text-center text-xs font-semibold uppercase tracking-widest transition',
                showTimePicker
                  ? 'border-b-2 border-gold-400 text-gold-300'
                  : 'text-slate-400 hover:text-slate-200',
              ].join(' ')}
            >
              Time
            </button>
          </div>

          {!showTimePicker ? (
            /* ─── Calendar ─── */
            <div className="p-3">
              {/* Month / Year header */}
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevMonth}
                  disabled={!canGoPrev}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 disabled:opacity-25"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-slate-100">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Day-of-week headers */}
              <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {DAY_LABELS.map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {grid.map((cell, i) => {
                  const disabled = !cell.inMonth || isBeforeMin(cell.year, cell.month, cell.day);
                  const isSelected =
                    cell.inMonth &&
                    selDay > 0 &&
                    isSameDay(cell.year, cell.month, cell.day, selYear, selMonth, selDay);
                  const isToday =
                    cell.inMonth && isSameDay(cell.year, cell.month, cell.day, todayY, todayM, todayD);

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleDayClick(cell.year, cell.month, cell.day)}
                      className={[
                        'relative flex h-9 w-full items-center justify-center rounded-lg text-xs font-medium transition',
                        disabled
                          ? 'cursor-default text-slate-700'
                          : isSelected
                            ? 'bg-gold-400 text-black font-bold shadow-md shadow-gold-400/30'
                            : isToday
                              ? 'border border-gold-400/40 text-gold-300 hover:bg-gold-400/15'
                              : 'text-slate-300 hover:bg-white/8',
                      ].join(' ')}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ─── Time picker ─── */
            <div ref={timeListRef} className="max-h-[260px] overflow-y-auto p-2">
              <div className="grid grid-cols-3 gap-1">
                {TIME_SLOTS.map((slot) => {
                  const disabled = isTimeSlotDisabled(slot.hour, slot.minute);
                  const isSelected = slot.hour === selHour && slot.minute === selMinute;

                  return (
                    <button
                      key={slot.label}
                      type="button"
                      disabled={disabled}
                      data-selected={isSelected}
                      onClick={() => handleTimeSelect(slot.hour, slot.minute)}
                      className={[
                        'rounded-lg px-2 py-2 text-xs font-medium transition',
                        disabled
                          ? 'cursor-default text-slate-700'
                          : isSelected
                            ? 'bg-gold-400 text-black font-bold shadow-md shadow-gold-400/30'
                            : 'text-slate-300 hover:bg-white/8',
                      ].join(' ')}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
