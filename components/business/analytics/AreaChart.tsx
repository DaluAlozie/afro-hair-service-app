import { LinearGradient, useFont, vec, Text as SKText, Circle } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { useTheme, View } from 'tamagui';
import { CartesianChart, Area, useChartPressState, Line } from 'victory-native';
import RobotoRegular from "@/assets/fonts/Roboto-Regular.ttf";
import RobotoBold from "@/assets/fonts/Roboto-Bold.ttf";
import {
  formatMoney,
  groupByDate,
  groupByDateInMonth,
  groupByMonth,
  groupByMonthInYear,
  groupByYear,
  Month,
  parseXLabel,
  parseYLabel
} from './utils';

export type Filter = {
  year?: number,
  month?: Month | "all",
  range?: 1 | 3 | 6 | 12 | "all",
  service: string | "all" | undefined,
  style: string | "all" | undefined,
}

type AreaChartProps = {
  data: Record<string, number>,
  filter: Filter,
}

export default function AreaChart({ data, filter }: AreaChartProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const scheme = useColorScheme();

  // Convert the data object to a sorted array
  const rawChartData = useMemo(() => {
    return Object.entries(data)
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
  }, [data]);

  // Calculate the overall time range (in months)
  const range = useMemo(() => {
    if (rawChartData.length === 0) return 0;
    const first = new Date(rawChartData[0].x);
    const last = new Date(rawChartData[rawChartData.length - 1].x);
    return (last.getFullYear() - first.getFullYear()) * 12 + last.getMonth() - first.getMonth();
  }, [rawChartData]);

  // Determine increment based on overall range
  const inc = useMemo(() => {
    if (range >= 24) return "year";
    if (range >= 3) return "month";
    return "date";
  }, [range]);

  // Group data based on filter and time increment
  const groupedData = useMemo(() => {
    if (filter.range) {
      if (inc === "date") return groupByDate(rawChartData);
      if (inc === "month") return groupByMonth(rawChartData);
      if (inc === "year") return groupByYear(rawChartData);
    } else if (filter.year) {
      if (filter.month === "all" || filter.month === undefined) {
        return groupByMonthInYear(rawChartData, filter.year);
      } else {
        return groupByDateInMonth(rawChartData, filter.month, filter.year);
      }
    }
    return groupByDate(rawChartData);
  }, [rawChartData, filter, inc]);

  // Use inc for filter.range; otherwise default to "month" when only a year is set
  const increment = useMemo(() => {
    if (filter.range) return inc;
    if (filter.year) return (filter.month === "all" || filter.month === undefined) ? "month" : "date";
    return "date";
  }, [filter, inc]);

  const font = useFont(RobotoRegular, 12);
  const chartFont = useFont(RobotoBold, 25);
  const { state, isActive } = useChartPressState({ x: "0", y: { y: 0 } as Record<string, number> });

  const date = useDerivedValue(() => {
    return "";
  }, [state, filter]);

  const value = useDerivedValue(() => {
    return "£" + formatMoney(state.y.y.value.value);
  }, [state]);

  const labelColor = theme.color.val;
  const lineColor = scheme === "dark" ? theme.gray2Dark.val : theme.gray4Light.val;
  const gradientColors = scheme === "dark"
    ? [theme.accent.val, theme.secondaryAccent.val+"70", theme.tertiaryAccent.val+"30"]
    : [theme.accent.val, theme.secondaryAccent.val+"50"];
  const xTickCount = increment === "date" ? 30 : increment === "month" ? 30 : 100;
  const min = useMemo(() => Math.min(...groupedData.map(item => item.y)), [groupedData]);
  const max = useMemo(() => Math.max(...groupedData.map(item => item.y)), [groupedData]);

  return (
    <View width="95%" height={width < 600 ? 250 : 350}>
      <CartesianChart
        data={groupedData}
        xKey="x"
        yKeys={["y"]}
        domainPadding={{ top: 30, bottom: 0, right: 15 }}
        xAxis={{
          font,
          labelColor,
          lineColor,
          formatXLabel: (value) => parseXLabel(value, filter, increment),
          tickCount: (width < 600 && xTickCount > 15) ? 15 : xTickCount,
          labelRotate: -45,
          labelOffset: 1,
        }}
        yAxis={[{
          font,
          labelColor,
          lineColor,
          formatYLabel: parseYLabel,
          domain: [min, max * 1.1],
        }]}
        chartPressState={state}
      >
        {({ points, chartBounds }) => (
          <>
            <SKText
              x={chartBounds.left + 10}
              y={25}
              font={chartFont}
              text={value}
              color={labelColor}
              style="fill"
            />
            <SKText
              x={chartBounds.right - 50}
              y={25}
              font={chartFont}
              text={date}
              color={labelColor}
              style="fill"
            />
            <Line
              points={points.y}
              color={theme.accent.val+"40"}
              strokeWidth={3}
              animate={{ type: "timing", duration: 500 }}
            />
            <Area
              points={points.y}
              y0={chartBounds.bottom}
              animate={{ type: "timing", duration: 500 }}
            >
              <LinearGradient
                start={vec(chartBounds.bottom, 50)}
                end={vec(chartBounds.bottom, chartBounds.bottom)}
                colors={gradientColors}
              />
            </Area>
            {isActive ? <ToolTip x={state.x.position} y={state.y.y.position} /> : null}
          </>
        )}
      </CartesianChart>
    </View>
  );
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  const theme = useTheme();
  return <Circle cx={x} cy={y} r={8} color={theme.secondaryAccent.val} opacity={0.8} />;
}
