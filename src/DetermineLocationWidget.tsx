import React, { useState, useEffect } from "react";
import { StagePanelLocation, StagePanelSection, UiItemsProvider, Widget, WidgetState, useActiveViewport } from "@itwin/appui-react";
import { Point3d } from "@itwin/core-geometry";
import { Button, ToggleSwitch, Alert } from "@itwin/itwinui-react";
import MarkerPinApi from "./MarkerPinApi";
import { MarkerPinDecorator } from "./common/marker-pin/MarkerPinDecorator";
import { Cartographic } from "@itwin/core-common";
import { imageElementFromUrl, IModelApp } from "@itwin/core-frontend";
import { mongoAppApi } from "./common/mongo";

export interface IssueMarker {
  point: Point3d;
}

const DetermineLocationWidget = () => {
  const viewport = useActiveViewport();
  const [showMarkers, setShowMarkers] = useState<boolean>(true);
  const [markers, setMarkers] = useState<IssueMarker[]>([]);
  const [userLocation, setUserLocation] = useState<Point3d | null>(null);
  const [refreshedLocation, setRefreshedLocation] = useState<Point3d | null>(null);
  const [markerPinDecorator] = React.useState<MarkerPinDecorator>(() => {
    return MarkerPinApi.setupDecorator();
  });
  const [inserted, setInserted] = React.useState<boolean>(false);

  // Load the images on widget startup
  useEffect(() => {
    MarkerPinApi._images = new Map();
    const p1 = imageElementFromUrl("pin_google_maps.svg").then((image) => {
      MarkerPinApi._images.set("pin_google_maps.svg", image);
    });
    const p2 = imageElementFromUrl("pin_celery.svg").then((image) => {
      MarkerPinApi._images.set("pin_celery.svg", image);
    });
    const p3 = imageElementFromUrl("pin_poloblue.svg").then((image) => {
      MarkerPinApi._images.set("pin_poloblue.svg", image);
    });

    Promise.all([p1, p2, p3])
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userGeoLocation: Point3d = new Point3d(position.coords.longitude, position.coords.latitude, 0);
        setUserLocation(userGeoLocation);
      },
      (error) => {
        console.error("Error getting user's geolocation:", error.message);
        const defaultLocation = new Point3d(50, 6, 0);
        setUserLocation(defaultLocation);
      }
    );

    // Use optional chaining to safely access properties/methods on `viewport`
    if (viewport?.viewFlags) {
      viewport.viewFlags = viewport?.viewFlags.with("backgroundMap", true);
      const fmtr = IModelApp.quantityFormatter;
      fmtr.setActiveUnitSystem("metric");
    }

    MarkerPinApi.enableDecorations(markerPinDecorator);
  }, [viewport, markerPinDecorator]);

  const handleAddMarkerClick = async () => {
    setInserted(false);
    if (!viewport) {
      console.error("Viewport is not available.");
      return;
    }

    if (!userLocation) {
      console.error("User location is not available.");
      return;
    }
    const cartesian: Cartographic[] = [];
    cartesian.push(Cartographic.fromDegrees({ longitude: userLocation.x, latitude: userLocation.y, height: 0 }));
    const spatialLocation = await IModelApp.viewManager.selectedView!.iModel.spatialFromCartographic(cartesian);

    const newMarker: IssueMarker = {
      point: spatialLocation[0],
    };

    setInserted(true);

    // Use MarkerPinApi to add a marker
    MarkerPinApi.addDigerMarkerPoint(markerPinDecorator, spatialLocation[0], MarkerPinApi._images.get("pin_google_maps.svg")!);

    console.log(`Marker added at Latitude: ${userLocation.y.toFixed(6)} = ${spatialLocation[0].y}, Longitude: ${userLocation.x.toFixed(6)} = ${spatialLocation[0].x}}`);
  };

  const handleToggleMarkers = () => {
    setShowMarkers(!showMarkers);
  };

  const handleRefresh = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const updatedGeoLocation: Point3d = new Point3d(position.coords.longitude, position.coords.latitude, 0);
        setUserLocation(updatedGeoLocation);
        setRefreshedLocation(updatedGeoLocation);
      },
      (error) => {
        console.error("Error getting updated geolocation:", error.message);
        // Handle error if needed
      }
    );
  };

  const renderInsertionAlert = () => {
    return (
      <Alert
        type="positive"
        onClose={() => setInserted(false)}
      >
        Location determined.
      </Alert>
    );
  };

  return (
    <div className="DetermineLocationWidget">
      {showMarkers && (userLocation || refreshedLocation) && (
        <div className="user-location">
          <p>User's Geolocation:</p>
          <p>Latitude: {(refreshedLocation?.y || userLocation?.y || 0).toFixed(6)}</p>
          <p>Longitude: {(refreshedLocation?.x || userLocation?.x || 0).toFixed(6)}</p>
        </div>
      )}

      {inserted ? renderInsertionAlert() : <></>}

      <ToggleSwitch
        className="toggle-markers"
        label="Show Markers"
        labelPosition="right"
        checked={showMarkers}
        onChange={() => setShowMarkers(!showMarkers)}
      />

      <Button className="add-marker-button" onClick={handleAddMarkerClick}>
        Add Marker
      </Button>

      <Button className="refresh-button" onClick={handleRefresh}>
        Refresh
      </Button>

      {/* Display photos for each marker */}
      {showMarkers &&
        markers.map((marker, index) => (
          <div key={index} className="marker-item">
            <p>
              Marker at Latitude: {marker.point.y.toFixed(6)}, Longitude: {marker.point.x.toFixed(6)}
            </p>
          </div>
        ))}
    </div>
  );
};

export class DetermineLocationWidgetProvider implements UiItemsProvider {
  public readonly id: string = "DetermineLocationWidgetProvider";

  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Bottom) {
      widgets.push({
        id: "DetermineLocationWidget",
        label: "DetermineLocationWidget",
        defaultState: WidgetState.Open,
        content: <DetermineLocationWidget />,
      });
    }
    return widgets;
  }
}
