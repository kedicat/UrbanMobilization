import React, { useEffect, useRef } from "react";
import {
    UiItemsProvider,
    StagePanelLocation,
    StagePanelSection,
    Widget,
    WidgetState,
} from "@itwin/appui-react"
import { Chart } from "chart.js/auto"

export class HumanIntensity implements UiItemsProvider {
    public readonly id: string = "HumanIntensity";

    provideWidgets(
        _stageID: string,
        _stageUsage: string,
        location: StagePanelLocation,
        _section?: StagePanelSection,
    ): ReadonlyArray<Widget> {
        const widgets: Widget[] = [];
        if (location === StagePanelLocation.Right) {
            widgets.push({
                id: "HumanIntensity",
                label: "HumanIntensity",
                defaultState: WidgetState.Open,
                content: <SensorChart />,
            });
        }
        return widgets;
    }
}

const SensorChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext("2d");
            if (ctx) {
                new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: ["8.00", "10.00", "12.00", "16.00", "18.00"],
                        datasets: [
                            {
                                label: "Human Intensity",
                                borderColor: "rgba(75,192,192,1)",
                                data: [65, 59, 80, 81, 56, 55],
                            },
                        ],
                    },
                });
            }
        }
    }, []);

    return <canvas ref={chartRef} />;
};