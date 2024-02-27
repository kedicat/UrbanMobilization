import React, { useEffect, useRef } from "react";
import {
    UiItemsProvider,
    StagePanelLocation,
    StagePanelSection,
    Widget,
    WidgetState,
} from "@itwin/appui-react"
import { Chart } from "chart.js/auto"

export class GenderGraph implements UiItemsProvider {
    public readonly id: string = "GenderGraph";

    provideWidgets(
        _stageID: string,
        _stageUsage: string,
        location: StagePanelLocation,
        _section?: StagePanelSection,
    ): ReadonlyArray<Widget> {
        const widgets: Widget[] = [];
        if (location === StagePanelLocation.Right) {
            widgets.push({
                id: "GenderGraph",
                label: "GenderGraph",
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
                    type: "bar",
                    data: {
                        labels: ["Woman", "Man", "Divers"],
                        datasets: [
                            {
                                label: "Gender Graph",
                                borderColor: "rgba(40,67,135,1)",
                                backgroundColor: ["rgba(255, 99, 132, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(255, 206, 86, 0.7)"],
                                data: [65, 59, 20],
                            },
                        ],
                    },
                });
            }
        }
    }, []);

    return <canvas ref={chartRef} />;
};