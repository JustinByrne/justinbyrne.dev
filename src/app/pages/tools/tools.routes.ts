import { Routes } from '@angular/router';
import { EnergyCost } from './energy-cost/energy-cost';
import { ToolsHome } from './tools-home/tools-home';

export const toolsRoutes: Routes = [
    {
        path: '',
        component: ToolsHome,
    },
    {
        path: 'energy-cost',
        component: EnergyCost,
    },
];
