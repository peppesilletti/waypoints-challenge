import React from "react"
import { buildGPX, BaseBuilder } from "gpx-builder"

import U from "./utils"

import styles from "./App.module.css"
import Map from "./components/Map/Map"
import MarkerList from "./components/MarkerList"

function App() {
  const [markers, setMarkers] = React.useState([])

  function onMarkerAdded(marker) {
    setMarkers([
      ...markers,
      {
        ...marker,
        id: `marker-${markers.length + 1}`,
        title: `Waypoint ${markers.length + 1}`,
      },
    ])
  }

  function onMarkerDeleted(marker) {
    setMarkers(markers.filter((m) => m.id !== marker.id))
  }

  function onMarkerMoved(newMarkers) {
    setMarkers(newMarkers)
  }

  function downloadGpxTrack() {
    const { Point } = BaseBuilder.MODELS

    const points = markers.map((marker) => new Point(marker.lat, marker.lng))

    const gpxData = new BaseBuilder()

    gpxData.setSegmentPoints(points)

    U.downloadFile(buildGPX(gpxData.toObject()))
  }

  return (
    <main className={styles.root}>
      <section className={styles.leftSection}>
        <header className={styles.leftSectionHeader}>
          <h3>Route Builder</h3>

          <hr className={styles.divider} />
        </header>

        <div className={styles.leftSectionBody}>
          <MarkerList
            markers={markers}
            onMarkerDeleted={onMarkerDeleted}
            onMarkerMoved={onMarkerMoved}
          />
        </div>

        <footer className={styles.leftSectionFooter}>
          <button
            disabled={markers?.length === 0}
            title={
              markers?.length === 0
                ? "No waypoints to download"
                : "Download GPX"
            }
            className={styles.downloadButton}
            onClick={downloadGpxTrack}
          >
            Download your Route
          </button>
        </footer>
      </section>

      <section className={styles.rightSection}>
        <Map onMarkerAdded={onMarkerAdded} markers={markers} />
      </section>
    </main>
  )
}

export default App
