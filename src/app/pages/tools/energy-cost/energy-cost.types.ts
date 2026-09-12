export interface Reading {
    start: Date;
    end: Date;
    consumptionKwh: number;
    estimatedCostPence: number;
    standingChargePence: number;
}

export interface Tariff {
    id: string;
    name: string;
    dayRatePence: number;
    nightRatePence: number;
    standingChargePenceDaily: number;
}

export interface DayTotals {
    consumptionDayKwh: number;
    consumptionNightKwh: number;
    actualCostDayPence: number;
    actualCostNightPence: number;
}

export interface TariffDayCost {
    dayPence: number;
    nightPence: number;
}
