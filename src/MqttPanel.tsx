import React, { useEffect, useRef } from "react";
import {
    UiItemsProvider,
    StagePanelLocation,
    StagePanelSection,
    Widget,
    WidgetState,
} from "@itwin/appui-react"
import HookMqtt from "./components/Hook";
import { Text } from "@itwin/itwinui-react";

export class MqttPanel implements UiItemsProvider {
    public readonly id: string = "MqttPanel";

    provideWidgets(
        _stageID: string,
        _stageUsage: string,
        location: StagePanelLocation,
        _section?: StagePanelSection,
    ): ReadonlyArray<Widget> {
        const widgets: Widget[] = [];
        if (location === StagePanelLocation.Right) {
            widgets.push({
                id: "MqttPanel",
                label: "MqttPanel",
                defaultState: WidgetState.Open,
                content: <HookMqtt/>,
            });
        }
        return widgets;
    }
}
