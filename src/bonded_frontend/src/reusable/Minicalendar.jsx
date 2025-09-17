import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./scss/_minicalendar.module.scss";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const toUTC = (d) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
const ymd = (d) => `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
const sameDay = (a, b) => a && b && a.getTime() === b.getTime();
const clampDate = (d, min, max) => {
    if (min && d < min) return min;
    if (max && d > max) return max;
    return d;
};
const addDays = (d, n) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));
const startOfMonthUTC = (y, m) => new Date(Date.UTC(y, m, 1));
const endOfMonthUTC = (y, m) => new Date(Date.UTC(y, m + 1, 0));

function monthMatrix(year, month, weekStartsOn = 0 /* 0=Sun..6=Sat */) {
    const first = startOfMonthUTC(year, month);
    const last = endOfMonthUTC(year, month);
    const firstWeekday = (first.getUTCDay() - weekStartsOn + 7) % 7;
    const daysInMonth = last.getUTCDate();

    const cells = [];
    // days from previous month to fill the first week
    for (let i = 0; i < firstWeekday; i++) {
        const d = addDays(first, i - firstWeekday);
        cells.push({ date: d, inCurrentMonth: false });
    }
    // current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(Date.UTC(year, month, day));
        cells.push({ date: d, inCurrentMonth: true });
    }
    // next month trailing days to fill 6 rows (42 cells)
    while (cells.length % 7 !== 0) {
        const d = addDays(last, cells.length - (firstWeekday + daysInMonth) + 1);
        cells.push({ date: d, inCurrentMonth: false });
    }
    while (cells.length < 42) {
        const lastCell = cells[cells.length - 1].date;
        cells.push({ date: addDays(lastCell, 1), inCurrentMonth: false });
    }

    // chunk by 7
    const weeks = [];
    for (let i = 0; i < 42; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
}

const WeekdayLabels = ({ weekStartsOn }) => {
    const labels = ["S", "M", "T", "W", "T", "F", "S"];
    const ordered = labels.slice(weekStartsOn).concat(labels.slice(0, weekStartsOn));
    return (
        <div className={styles.weekRow} aria-hidden>
            {ordered.map((l, index) => (
                <div key={`${l}-${index}`} className={styles.weekday}>{l}</div>
            ))}
        </div>
    );
};

// ---------- Component ----------
export default function Minicalendar({
    mode = "range",
    weekStartsOn = 0,
    initialMonth,
    minDate,
    maxDate,
    value,
    defaultValue,
    onChange,
    onApply,
    onClear,
}) {
    const todayUTC = toUTC(new Date());

    // Normalize bounds to UTC dates at midnight
    const minUTC = minDate ? toUTC(minDate) : null;
    const maxUTC = maxDate ? toUTC(maxDate) : null;

    const uncontrolledInit = useMemo(() => {
        if (value) return null;
        if (mode === "single") {
            const d = defaultValue instanceof Date ? toUTC(defaultValue) : null;
            return d ? { start: d, end: d } : { start: null, end: null };
        }
        if (defaultValue && typeof defaultValue === "object") {
            const s = defaultValue.start ? toUTC(defaultValue.start) : null;
            const e = defaultValue.end ? toUTC(defaultValue.end) : null;
            return { start: s, end: e };
        }
        return { start: null, end: null };
    }, [defaultValue, mode, value]);

    const [internal, setInternal] = useState(uncontrolledInit);
    const isControlled = value !== undefined;

    const sel = useMemo(() => {
        if (isControlled) {
            if (mode === "single") {
                const d = value instanceof Date ? toUTC(value) : null;
                return { start: d, end: d };
            }
            const s = value?.start ? toUTC(value.start) : null;
            const e = value?.end ? toUTC(value.end) : null;
            return { start: s, end: e };
        }
        return internal || { start: null, end: null };
    }, [isControlled, value, internal, mode]);

    // View state (month/year)
    const base = initialMonth ? toUTC(initialMonth) : todayUTC;
    const [{ year, month }, setYM] = useState({ year: base.getUTCFullYear(), month: base.getUTCMonth() });

    const [hoverDate, setHoverDate] = useState(null);

    const weeks = useMemo(() => monthMatrix(year, month, weekStartsOn), [year, month, weekStartsOn]);

    const commit = (next) => {
        if (!isControlled) setInternal(next);
        if (onChange) {
            if (mode === "single") onChange(next.start);
            else onChange(next);
        }
    };

    const clear = () => {
        const empty = { start: null, end: null };
        commit(empty);
        onClear && onClear();
    };

    const setSingle = (d) => commit({ start: d, end: d });

    const setRange = (a, b) => {
        if (!a && !b) return commit({ start: null, end: null });
        const [start, end] = a && b && a > b ? [b, a] : [a, b];
        commit({ start, end });
    };

    // CLICK-TO-RANGE LOGIC
    const handleDayClick = (d, disabled) => {
        if (disabled) return;

        // normalize: ensure we have ordered [start, end]
        const curStart = sel.start;
        const curEnd = sel.end;

        // 1) empty -> pick start
        if (!curStart && !curEnd) {
            commit({ start: d, end: d });
            return;
        }

        // 2) only start -> set end (order automatically)
        if (curStart && !curEnd) {
            const [start, end] = d < curStart ? [d, curStart] : [curStart, d];
            commit({ start, end });
            return;
        }

        // 3) have full range
        if (curStart && curEnd) {
            if (d < curStart) {               // expand backward
                commit({ start: d, end: curEnd });
            } else if (d > curEnd) {          // expand forward
                commit({ start: curStart, end: d });
            } else {                          // click inside -> restart from this day
                commit({ start: d, end: d });
            }
        }
    };

    const prevMonth = () => {
        const m = month - 1;
        if (m < 0) setYM({ year: year - 1, month: 11 });
        else setYM({ year, month: m });
    };
    const nextMonth = () => {
        const m = month + 1;
        if (m > 11) setYM({ year: year + 1, month: 0 });
        else setYM({ year, month: m });
    };

    const prevYear = () => {
        setYM({ year: year - 1, month });
    };
    const nextYear = () => {
        setYM({ year: year + 1, month });
    };

    const primaryLabel = mode === "single" ? "Select" : "Apply";


    // Keyboard support: arrows move month
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowLeft" && (e.metaKey || e.ctrlKey)) prevMonth();
            if (e.key === "ArrowRight" && (e.metaKey || e.ctrlKey)) nextMonth();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [year, month]);

    const inRange = (d) => {
        const { start, end } = sel;
        if (!start || !end) return start && d.getTime() === start.getTime();
        const t = d.getTime(), a = start.getTime(), b = end.getTime();
        return t >= Math.min(a, b) && t <= Math.max(a, b);
    };
    const isStart = (d) => sel.start && d.getTime() === sel.start.getTime();
    const isEnd = (d) => sel.end && d.getTime() === sel.end.getTime();

    // --- Preview helpers (when only start is set) ---
    const hasOnlyStart = !!sel.start && !sel.end;
    const previewInRange = (d) => {
        if (!hasOnlyStart || !hoverDate) return false;
        const t = d.getTime(), a = sel.start.getTime(), b = hoverDate.getTime();
        const lo = Math.min(a, b), hi = Math.max(a, b);
        return t >= lo && t <= hi;
    };
    const isPreviewStart = (d) => {
        if (!hasOnlyStart || !hoverDate) return false;
        const a = sel.start.getTime(), b = hoverDate.getTime();
        const startT = Math.min(a, b);
        return d.getTime() === startT;
    };
    const isPreviewEnd = (d) => {
        if (!hasOnlyStart || !hoverDate) return false;
        const a = sel.start.getTime(), b = hoverDate.getTime();
        const endT = Math.max(a, b);
        return d.getTime() === endT;
    };

    const monthLabel = new Date(Date.UTC(year, month, 1)).toLocaleString(undefined, { month: "long" });

    return (
        <div
            className={styles.wrapper}
            role="dialog"
            aria-label="Mini calendar"
            onMouseLeave={() => setHoverDate(null)}
        >
            <div className={styles.header}>
                <button className={styles.navBtn} onClick={prevYear} aria-label="Previous year"><ChevronLeft /></button>
                <div className={styles.title}>
                    <div className={styles.year}>{year}</div>
                    <div className={styles.month}>
                        <button className={styles.navBtnSm} onClick={prevMonth} aria-label="Previous month"><ChevronLeft /></button>
                        <span>{monthLabel}</span>
                        <button className={styles.navBtnSm} onClick={nextMonth} aria-label="Next month"><ChevronRight /></button>
                    </div>
                </div>
                <button className={styles.navBtn} onClick={nextYear} aria-label="Next year"><ChevronRight /></button>
            </div>

            <WeekdayLabels weekStartsOn={weekStartsOn} />

            <div className={styles.grid} role="grid" aria-readonly="true">
                {weeks.map((row, i) => (
                    <div key={i} className={styles.row} role="row">
                        {row.map(({ date, inCurrentMonth }) => {
                            const d = clampDate(date, minUTC, maxUTC);
                            const disabled = (minUTC && date < minUTC) || (maxUTC && date > maxUTC);
                            const isToday = ymd(date) === ymd(todayUTC);
                            const selected = inRange(date); // reflect full range for ARIA
                            const classes = [
                                styles.cell,
                                inCurrentMonth ? styles.inMonth : styles.outMonth,
                                disabled && styles.disabled,
                                isToday && styles.today,
                                mode === "range" && inRange(date) && styles.inRange,
                                mode === "range" && isStart(date) && styles.rangeStart,
                                mode === "range" && isEnd(date) && styles.rangeEnd,
                                // preview classes (only when start picked and not committed end)
                                mode === "range" && previewInRange(date) && styles.previewInRange,
                                mode === "range" && isPreviewStart(date) && styles.previewStart,
                                mode === "range" && isPreviewEnd(date) && styles.previewEnd,
                                mode === "single" && selected && styles.singleSelected,
                            ].filter(Boolean).join(" ");

                            return (
                                <div
                                    key={ymd(date)}
                                    role="gridcell"
                                    aria-selected={!!selected}
                                    className={classes}
                                    onClick={() => handleDayClick(d, disabled)}
                                    onMouseEnter={() => !disabled && setHoverDate(d)}
                                >
                                    <span className={styles.dayNum}>{date.getUTCDate()}</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <button
                    className={styles.primary}
                    onClick={() => onApply?.(mode === "single" ? sel.start : sel)}
                    disabled={mode === "single" ? !sel.start : !(sel.start && sel.end)}
                >
                    {primaryLabel}
                </button>
                <button className={styles.secondary} onClick={clear}>Clear</button>
            </div>
        </div>
    );
}

Minicalendar.propTypes = {
    mode: PropTypes.oneOf(["single", "range"]),
    weekStartsOn: PropTypes.number,
    initialMonth: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    value: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.shape({ start: PropTypes.instanceOf(Date), end: PropTypes.instanceOf(Date) }),
    ]),
    defaultValue: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.shape({ start: PropTypes.instanceOf(Date), end: PropTypes.instanceOf(Date) }),
    ]),
    onChange: PropTypes.func,
    onApply: PropTypes.func,
    onClear: PropTypes.func,
};
