import { Component, Input, OnChanges } from '@angular/core';

export interface ChartSegment {
    name?: string;
    values: number[];
    color?: string;
}

export interface ChartSeries {
    name: string;
    color?: string;
    values?: number[];
    segments?: ChartSegment[];
}

interface ResolvedSegment {
    name: string;
    values: number[];
    color: string;
}

interface ResolvedSeries {
    name: string;
    segments: ResolvedSegment[];
}

interface RenderSegment {
    color: string;
    value: number;
}

interface RenderBar {
    title: string;
    height: number;
    segments: RenderSegment[];
}

interface RenderGroup {
    label: string;
    bars: RenderBar[];
}

interface RenderLegend {
    name: string;
    colors: string[];
}

const DEFAULT_COLORS = [
    '#7aa2f7',
    '#9ece6a',
    '#bb9af7',
    '#f7768e',
    '#e0af68',
    '#e5e7eb',
];

const SEGMENT_TINT = 0.35;
const SEGMENT_SHADE = -0.3;

@Component({
    selector: 'app-bar-chart',
    imports: [],
    templateUrl: './bar-chart.html',
    styleUrl: './bar-chart.css',
})
export class BarChart implements OnChanges {

    @Input() labels: string[] = [];
    @Input() series: ChartSeries[] = [];
    @Input() formatValue: (value: number) => string = value => `${value}`;
    @Input() legendNote: string = '';

    public groups: RenderGroup[] = [];
    public legends: RenderLegend[] = [];

    public ngOnChanges(): void {
        const resolvedSeries = this.series.map((chartSeries, seriesIndex) => this.normalise(chartSeries, seriesIndex));

        const maxValue = Math.max(1, ...this.labels.flatMap((_, labelIndex) => resolvedSeries.map(series => total(series, labelIndex))));

        this.groups = this.labels.map((label, labelIndex) => ({
            label,
            bars: resolvedSeries.map(series => ({
                title: this.title(series, labelIndex),
                height: Math.max(1, (total(series, labelIndex) / maxValue) * 100),
                segments: series.segments.map(segment => ({
                    color: segment.color,
                    value: segment.values[labelIndex] ?? 0,
                })),
            })),
        }));

        this.legends = resolvedSeries.map(series => ({
            name: series.name,
            colors: series.segments.map(segment => segment.color),
        }));
    }

    /**
     * Collapses the two authoring shapes (a flat `values` array, or explicit `segments`) into a
     * single stacked form, filling in any colours the caller left out.
     */
    private normalise(series: ChartSeries, index: number): ResolvedSeries {
        const color = series.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
        const segments = series.segments?.length
            ? series.segments
            : [{ values: series.values ?? [] }];

        return {
            name: series.name,
            segments: segments.map((segment, segmentIndex) => ({
                name: segment.name ?? '',
                values: segment.values,
                color: segment.color ?? segmentColor(color, segmentIndex, segments.length),
            })),
        };
    }

    private title(series: ResolvedSeries, index: number): string {
        const parts = series.segments.map(segment => {
            const value = this.formatValue(segment.values[index] ?? 0);

            return segment.name ? `${segment.name}: ${value}` : value;
        });

        return `${series.name} — ${parts.join(', ')}`;
    }
}

function total(series: ResolvedSeries, index: number): number {
    return series.segments.reduce((sum, segment) => sum + (segment.values[index] ?? 0), 0);
}

/**
 * Spreads a series colour across its stacked segments, from a light tint at the base of the bar
 * to a darker shade at the top. A single segment keeps the series colour untouched.
 */
function segmentColor(base: string, index: number, count: number): string {
    if (count < 2) return base;

    const ratio = index / (count - 1);

    return shade(base, SEGMENT_TINT + (SEGMENT_SHADE - SEGMENT_TINT) * ratio);
}

function shade(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);

    const channel = (shift: number): number => {
        const value = (num >> shift) & 0xff;
        const adjusted = percent >= 0
            ? value + (255 - value) * percent
            : value + value * percent;

        return Math.max(0, Math.min(255, Math.round(adjusted)));
    };

    const red = channel(16);
    const green = channel(8);
    const blue = channel(0);

    return `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`;
}
