import Papa from 'papaparse';
import { DayTotals, Reading, Tariff, TariffDayCost } from './energy-cost.types';

const DAY_RATE_START_HOUR = 5.5; // 05:30
const DAY_RATE_END_HOUR = 23.5; // 23:30

export interface ParseResult {
    readings: Reading[];
    skippedRows: number;
}

export function parseEnergyCsv(csvText: string): ParseResult {
    const result = Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim(),
        transform: value => value.trim(),
    });

    const readings: Reading[] = [];
    let skippedRows = 0;

    for (const row of result.data) {
        const reading = toReading(row);

        if (reading) {
            readings.push(reading);
        } else {
            skippedRows++;
        }
    }

    return { readings, skippedRows };
}

function toReading(row: Record<string, string>): Reading | null {
    const consumptionKwh = parseNumber(row['Consumption (kwh)']);
    const start = parseDate(row['Start']);
    const end = parseDate(row['End']);

    if (consumptionKwh === null || start === null || end === null) {
        return null;
    }

    return {
        consumptionKwh,
        estimatedCostPence: parseNumber(row['Estimated Cost Inc. Tax (p)']) ?? 0,
        standingChargePence: parseNumber(row['Standing Charge Inc. Tax (p)']) ?? 0,
        start,
        end,
    };
}

function parseNumber(value: string | undefined): number | null {
    if (value === undefined || value.trim() === '') return null;

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
}

function parseDate(value: string | undefined): Date | null {
    if (!value) return null;

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function dayKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function groupActualByDay(readings: Reading[]): Map<string, DayTotals> {
    const byDay = new Map<string, DayTotals>();

    for (const reading of readings) {
        const key = dayKey(reading.start);
        const existing = byDay.get(key) ?? {
            consumptionDayKwh: 0,
            consumptionNightKwh: 0,
            actualCostDayPence: 0,
            actualCostNightPence: 0,
        };

        const cost = reading.estimatedCostPence + reading.standingChargePence;

        if (isDayRate(reading.start)) {
            existing.consumptionDayKwh += reading.consumptionKwh;
            existing.actualCostDayPence += cost;
        } else {
            existing.consumptionNightKwh += reading.consumptionKwh;
            existing.actualCostNightPence += cost;
        }

        byDay.set(key, existing);
    }

    return byDay;
}

export function calculateTariffCostsByDay(readings: Reading[], tariff: Tariff): Map<string, TariffDayCost> {
    const byDay = new Map<string, TariffDayCost>();

    for (const reading of readings) {
        const key = dayKey(reading.start);
        const existing = byDay.get(key) ?? { dayPence: 0, nightPence: 0 };

        if (isDayRate(reading.start)) {
            existing.dayPence += reading.consumptionKwh * tariff.dayRatePence;
        } else {
            existing.nightPence += reading.consumptionKwh * tariff.nightRatePence;
        }

        byDay.set(key, existing);
    }

    for (const cost of byDay.values()) {
        cost.dayPence += tariff.standingChargePenceDaily;
    }

    return byDay;
}

function isDayRate(date: Date): boolean {
    const hours = date.getHours() + date.getMinutes() / 60;

    return hours >= DAY_RATE_START_HOUR && hours < DAY_RATE_END_HOUR;
}
