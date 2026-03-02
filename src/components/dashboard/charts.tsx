"use client";

import { motion } from "framer-motion";

interface BarChartProps {
    data: { label: string; value: number; color?: string }[];
    maxValue?: number;
    height?: number;
}

export function BarChart({ data, maxValue, height = 200 }: BarChartProps) {
    const max = maxValue || Math.max(...data.map((d) => d.value), 1);

    return (
        <div className="flex items-end gap-2 justify-between" style={{ height }}>
            {data.map((item, i) => {
                const barHeight = Math.max((item.value / max) * 100, 4);
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.value}
                        </span>
                        <div className="w-full relative flex items-end justify-center bg-slate-100 dark:bg-slate-800/50 rounded-t-md overflow-hidden" style={{ height: height - 30 }}>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${barHeight}%` }}
                                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                className="w-[80%] rounded-t-sm hover:opacity-80 transition-opacity"
                                style={{
                                    background: item.color || "linear-gradient(180deg, #f97316, #ea580c)",
                                    minHeight: "4px",
                                }}
                            />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate w-full text-center mt-1">
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

interface DonutChartProps {
    segments: { label: string; value: number; color: string }[];
    centerLabel?: string;
    centerValue?: string;
    size?: number;
}

export function DonutChart({ segments, centerLabel, centerValue, size = 160 }: DonutChartProps) {
    const total = segments.reduce((acc, s) => acc + s.value, 0);
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let cumulativeOffset = 0;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg viewBox="0 0 160 160" className="transform -rotate-90" style={{ width: size, height: size }}>
                {total === 0 ? (
                    <circle cx="80" cy="80" r={radius} fill="none" stroke="#1e293b" strokeWidth="18" />
                ) : (
                    segments.map((seg, i) => {
                        const segLength = (seg.value / total) * circumference;
                        const offset = cumulativeOffset;
                        cumulativeOffset += segLength;
                        return (
                            <motion.circle
                                key={i}
                                cx="80" cy="80" r={radius}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth="18"
                                initial={{ strokeDasharray: `0 ${circumference}` }}
                                animate={{ strokeDasharray: `${segLength} ${circumference - segLength}`, strokeDashoffset: -offset }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                strokeLinecap="round"
                            />
                        );
                    })
                )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {centerValue && <p className="text-2xl font-black text-slate-900 dark:text-white">{centerValue}</p>}
                {centerLabel && <p className="text-[10px] font-bold text-slate-500 uppercase">{centerLabel}</p>}
            </div>
        </div>
    );
}

interface SparklineProps {
    data: number[];
    color?: string;
    height?: number;
}

export function Sparkline({ data, color = "#f97316", height = 40 }: SparklineProps) {
    if (data.length === 0) return null;

    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const width = 200;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4);
        return `${x},${y}`;
    }).join(" ");

    const areaPoints = `0,${height} ${points} ${width},${height}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <motion.polygon
                points={areaPoints}
                fill={`url(#grad-${color.replace('#', '')})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </svg>
    );
}
