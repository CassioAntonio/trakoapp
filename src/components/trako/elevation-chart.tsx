import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { elevationSeries } from "@/lib/stats";
import type { GeoPoint } from "@/types";

export function ElevationChart({
  track,
  metric = "altitude",
}: {
  track: GeoPoint[];
  metric?: "altitude" | "speed";
}) {
  const data = elevationSeries(track);
  const color = metric === "altitude" ? "var(--chart-1)" : "var(--chart-2)";

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="km"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickFormatter={(v: number) => `${v.toFixed(0)}`}
            stroke="var(--border)"
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            stroke="var(--border)"
            width={44}
          />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
            formatter={(v: number) => [metric === "altitude" ? `${v} m` : `${v} km/h`, "km"]}
            labelFormatter={(l) => `km ${l}`}
          />
          <Area
            type="monotone"
            dataKey={metric}
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${metric})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
