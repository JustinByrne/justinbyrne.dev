import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

interface ToolLink {
    name: string;
    description: string;
    path: string;
}

@Component({
    selector: 'app-tools-home',
    imports: [RouterLink],
    templateUrl: './tools-home.html',
    styleUrl: './tools-home.css',
})
export class ToolsHome {

    public tools: ToolLink[] = [
        {
            name: 'Energy Cost Tool',
            description: 'Upload a CSV of energy readings and compare tariffs against your actual cost.',
            path: '/tools/energy-cost',
        },
    ];

    constructor(
        protected title: Title,
    ) {
        this.title.setTitle('Tools | JustinByrne.dev');
    }
}
