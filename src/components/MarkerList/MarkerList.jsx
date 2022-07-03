import { useRef } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faBars } from "@fortawesome/free-solid-svg-icons"
import styles from "./MarkerList.module.css"

function MarkerList({ markers = [], onMarkerMoved, onMarkerDeleted }) {
  const dragMarker = useRef()
  const dragOverMarker = useRef()

  function dragStart(e, position) {
    dragMarker.current = position
  }

  const dragEnter = (e, position) => {
    dragOverMarker.current = position
  }

  const drop = (e) => {
    const newMarkerList = [...markers]
    const dragMarkerContent = newMarkerList[dragMarker.current]

    newMarkerList.splice(dragMarker.current, 1)
    newMarkerList.splice(dragOverMarker.current, 0, dragMarkerContent)

    dragMarker.current = null
    dragOverMarker.current = null

    onMarkerMoved(newMarkerList)
  }

  return (
    <div className={styles.markerList}>
      {markers.length === 0 && (
        <div style={{ textAlign: "center" }}>
          Tap on the map to assign a waypoint
        </div>
      )}

      {markers.map((marker, index) => {
        return (
          <div
            key={marker.id}
            draggable
            onDragStart={(e) => dragStart(e, index)}
            onDragEnter={(e) => dragEnter(e, index)}
            onDragEnd={drop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className={styles.markerListItem}>
              <div className={styles.markerItemLeft}>
                <FontAwesomeIcon
                  className={styles.icon}
                  style={{ marginRight: 10 }}
                  icon={faBars}
                />
                <div style={{ fontWeight: "bold" }}>{marker.title}</div>
              </div>

              <div className={styles.markerItemRight}>
                <button onClick={() => onMarkerDeleted(marker)}>
                  <FontAwesomeIcon className={styles.icon} icon={faTrash} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MarkerList
