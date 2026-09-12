import { Component, computed, HostListener, Signal, signal, WritableSignal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BarChart, ChartSeries } from '../../../shared/bar-chart/bar-chart';
import { calculateTariffCostsByDay, groupActualByDay, parseEnergyCsv } from './energy-cost-engine';
import { DayTotals, Reading, Tariff } from './energy-cost.types';

const ACTUAL_COLOR = '#e5e7eb';
const TARIFF_COLORS = ['#7aa2f7', '#9ece6a', '#bb9af7', '#f7768e', '#e0af68'];

interface Saving {
    tariff: Tariff;
    differencePence: number;
}

@Component({
    selector: 'app-energy-cost',
    imports: [BarChart],
    templateUrl: './energy-cost.html',
    styleUrl: './energy-cost.css',
})
export class EnergyCost {

    public readings: WritableSignal<Reading[]> = signal([]);
    public skippedRows: WritableSignal<number> = signal(0);
    public fileName: WritableSignal<string | null> = signal(null);
    public parseError: WritableSignal<string | null> = signal(null);
    public tariffs: WritableSignal<Tariff[]> = signal([]);
    public isAddTariffModalOpen: WritableSignal<boolean> = signal(false);

    public draftName: WritableSignal<string> = signal('');
    public draftDayRate: WritableSignal<string> = signal('');
    public draftNightRate: WritableSignal<string> = signal('');
    public draftStandingCharge: WritableSignal<string> = signal('');

    public days: Signal<string[]>;
    public dayLabels: Signal<string[]>;
    public consumptionSeries: Signal<ChartSeries[]>;
    public costSeries: Signal<ChartSeries[]>;
    public savings: Signal<Saving[]>;

    private actualByDay: Signal<Map<string, DayTotals>>;

    constructor(
        protected title: Title,
    ) {
        this.title.setTitle('Energy Cost Tool | JustinByrne.dev');

        this.actualByDay = computed(() => groupActualByDay(this.readings()));
        this.days = computed(() => Array.from(this.actualByDay().keys()).sort());
        this.dayLabels = computed(() => this.days().map(day => this.formatDay(day)));

        this.consumptionSeries = computed(() => {
            const byDay = this.actualByDay();

            return [{
                name: 'Consumption',
                color: ACTUAL_COLOR,
                segments: [
                    { name: 'Day', values: this.days().map(day => byDay.get(day)?.consumptionDayKwh ?? 0) },
                    { name: 'Night', values: this.days().map(day => byDay.get(day)?.consumptionNightKwh ?? 0) },
                ],
            }];
        });

        this.costSeries = computed(() => {
            const byDay = this.actualByDay();
            const days = this.days();
            const readings = this.readings();

            const actual: ChartSeries = {
                name: 'Actual',
                color: ACTUAL_COLOR,
                segments: [
                    { name: 'Day', values: days.map(day => byDay.get(day)?.actualCostDayPence ?? 0) },
                    { name: 'Night', values: days.map(day => byDay.get(day)?.actualCostNightPence ?? 0) },
                ],
            };

            const tariffSeries: ChartSeries[] = this.tariffs().map((tariff, index) => {
                const costByDay = calculateTariffCostsByDay(readings, tariff);

                return {
                    name: tariff.name,
                    color: TARIFF_COLORS[index % TARIFF_COLORS.length],
                    segments: [
                        { name: 'Day', values: days.map(day => costByDay.get(day)?.dayPence ?? 0) },
                        { name: 'Night', values: days.map(day => costByDay.get(day)?.nightPence ?? 0) },
                    ],
                };
            });

            return [actual, ...tariffSeries];
        });

        this.savings = computed(() => {
            const readings = this.readings();
            const actualTotal = Array.from(this.actualByDay().values())
                .reduce((sum, day) => sum + day.actualCostDayPence + day.actualCostNightPence, 0);

            return this.tariffs().map(tariff => {
                const tariffTotal = Array.from(calculateTariffCostsByDay(readings, tariff).values())
                    .reduce((sum, cost) => sum + cost.dayPence + cost.nightPence, 0);

                return {
                    tariff,
                    differencePence: actualTotal - tariffTotal,
                };
            });
        });
    }

    public async onFileSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        const text = await file.text();
        const { readings, skippedRows } = parseEnergyCsv(text);

        if (!readings.length) {
            this.parseError.set('No valid rows found in this CSV.');
            input.value = '';
            return;
        }

        this.parseError.set(null);
        this.fileName.set(file.name);
        this.readings.set(readings);
        this.skippedRows.set(skippedRows);
        input.value = '';
    }

    public openAddTariffModal(): void {
        this.draftName.set('');
        this.draftDayRate.set('');
        this.draftNightRate.set('');
        this.draftStandingCharge.set('');
        this.isAddTariffModalOpen.set(true);
    }

    public closeAddTariffModal(): void {
        this.isAddTariffModalOpen.set(false);
    }

    @HostListener('document:keydown.escape')
    public onEscapeKey(): void {
        this.closeAddTariffModal();
    }

    public addTariff(): void {
        const name = this.draftName().trim();
        const dayRatePence = Number(this.draftDayRate());
        const nightRatePence = Number(this.draftNightRate());
        const standingChargePenceDaily = Number(this.draftStandingCharge());

        if (
            !name
            || !Number.isFinite(dayRatePence)
            || !Number.isFinite(nightRatePence)
            || !Number.isFinite(standingChargePenceDaily)
        ) {
            return;
        }

        this.tariffs.update(tariffs => [...tariffs, {
            id: crypto.randomUUID(),
            name,
            dayRatePence,
            nightRatePence,
            standingChargePenceDaily,
        }]);

        this.closeAddTariffModal();
    }

    public removeTariff(id: string): void {
        this.tariffs.update(tariffs => tariffs.filter(tariff => tariff.id !== id));
    }

    public formatKwh(value: number): string {
        return `${value.toFixed(1)} kWh`;
    }

    public formatCurrency(value: number): string {
        return `£${(value / 100).toFixed(2)}`;
    }

    public formatRate(value: number): string {
        return `${value.toFixed(2)}p`;
    }

    private formatDay(day: string): string {
        const date = new Date(`${day}T00:00:00`);

        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    }
}
