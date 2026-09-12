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

    public maxValue = 1;

    public ngOnChanges(): void {
        const totals = this.series.flatMap(s => s.dayValues.map((day, i) => day + (s.nightValues[i] ?? 0)));

        this.maxValue = Math.max(1, ...totals);
    }

    public barHeight(dayValue: number, nightValue: number): number {
        return Math.max(1, ((dayValue + nightValue) / this.maxValue) * 100);
    }

    public dayColor(color: string): string {
        return shade(color, DAY_TINT);
    }

    public nightColor(color: string): string {
        return shade(color, NIGHT_SHADE);
    }
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

    const r = channel(16);
    const g = channel(8);
    const b = channel(0);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
