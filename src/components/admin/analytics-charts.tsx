"use client";

import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Lightweight, dependency-free SVG charts for the admin dashboard.
 * Every chart has a text alternative and a visible legend/labels so meaning is
 * never conveyed by colour alone (ui-ux-pro-max: charts & data guideline).
 */

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  href?: string;
}

const formatShort = (value: number) => {
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return String(Math.round(value));
};

function smoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return path;
}

interface AreaChartProps {
  data: ChartPoint[];
  gradientId: string;
  color?: string;
  valueLabel?: (value: number) => string;
  ariaLabel: string;
  className?: string;
}

export function AreaChart({
  data,
  gradientId,
  color = "#1877f2",
  valueLabel = formatShort,
  ariaLabel,
  className,
}: AreaChartProps) {
  const width = 640;
  const height = 210;
  const padLeft = 46;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 30;
  const baseY = height - padBottom;
  const max = Math.max(...data.map((point) => point.value), 1) * 1.16;
  const spanX = width - padLeft - padRight;

  const points = data.map((point, index) => ({
    x: data.length === 1 ? padLeft + spanX / 2 : padLeft + (spanX * index) / (data.length - 1),
    y: baseY - (point.value / max) * (baseY - padTop),
  }));
  const line = smoothPath(points);
  const area = points.length
    ? `${line} L ${points[points.length - 1].x.toFixed(2)} ${baseY} L ${points[0].x.toFixed(2)} ${baseY} Z`
    : "";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className ?? "h-auto w-full"}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3].map((tick) => {
        const y = padTop + ((baseY - padTop) * tick) / 3;
        const tickValue = max * (1 - tick / 3);
        return (
          <g key={tick}>
            <line
              x1={padLeft}
              x2={width - padRight}
              y1={y}
              y2={y}
              stroke="#e8eef6"
              strokeDasharray={tick === 3 ? undefined : "4 5"}
            />
            <text x={padLeft - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#8c98a8">
              {valueLabel(tickValue)}
            </text>
          </g>
        );
      })}

      {area && <path d={area} fill={`url(#${gradientId})`} />}
      {line && <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />}

      {points.map((point, index) => (
        <g key={data[index].label}>
          <circle cx={point.x} cy={point.y} r="7" fill={color} fillOpacity="0.14" />
          <circle cx={point.x} cy={point.y} r="3.2" fill="#ffffff" stroke={color} strokeWidth="2">
            <title>{`${data[index].label}: ${valueLabel(data[index].value)}`}</title>
          </circle>
          <text x={point.x} y={height - 8} textAnchor="middle" fontSize="10" fill="#6b7280">
            {data[index].label}
          </text>
        </g>
      ))}
    </svg>
  );
}

interface SparklineProps {
  data: number[];
  color: string;
  ariaLabel: string;
}

export function Sparkline({ data, color, ariaLabel }: SparklineProps) {
  if (data.length < 2) return <span aria-hidden="true" className="block h-8" />;
  const width = 120;
  const height = 34;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data.map((value, index) => ({
    x: (width * index) / (data.length - 1),
    y: height - 3 - ((value - min) / range) * (height - 8),
  }));
  const path = smoothPath(points);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-8 w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <path d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

interface DonutChartProps {
  segments: DonutSegment[];
  total: number;
  centerLabel: string;
  ariaLabel: string;
}

export function DonutChart({ segments, total, centerLabel, ariaLabel }: DonutChartProps) {
  const size = 180;
  const center = size / 2;
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:flex-col xl:flex-row">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-[168px] w-[168px] shrink-0"
        role="img"
        aria-label={ariaLabel}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#eef2f7"
          strokeWidth="18"
        />
        <g transform={`rotate(-90 ${center} ${center})`}>
          {segments.map((segment) => {
            const length = total > 0 ? (segment.value / total) * circumference : 0;
            const visible = Math.max(length - (length > 8 ? 3 : 0), 0);
            const dash = `${visible} ${circumference - visible}`;
            const start = offset;
            offset += length;
            if (length <= 0) return null;
            return (
              <circle
                key={segment.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="18"
                strokeDasharray={dash}
                strokeDashoffset={-start}
              >
                <title>{`${segment.label}: ${segment.value}`}</title>
              </circle>
            );
          })}
        </g>
        <text x={center} y={center - 4} textAnchor="middle" fontSize="26" fontWeight="700" fill="#1b1b1b">
          {total}
        </text>
        <text x={center} y={center + 15} textAnchor="middle" fontSize="10" fill="#6b7280">
          {centerLabel}
        </text>
      </svg>

      <ul className="w-full space-y-2.5">
        {segments.map((segment) => {
          const percent = total > 0 ? Math.round((segment.value / total) * 100) : 0;
          const content: ReactNode = (
            <>
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: segment.color }} />
              <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-body">
                {segment.label}
              </span>
              <span className="text-[11px] font-semibold text-ink">{segment.value}</span>
              <span className="w-8 text-right text-[10px] text-muted">{percent}%</span>
            </>
          );
          return (
            <li key={segment.label}>
              {segment.href ? (
                <Link
                  href={segment.href}
                  className="flex items-center gap-2 rounded-[6px] px-1 py-0.5 transition-colors hover:bg-brand-50"
                >
                  {content}
                </Link>
              ) : (
                <div className="flex items-center gap-2 px-1 py-0.5">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
