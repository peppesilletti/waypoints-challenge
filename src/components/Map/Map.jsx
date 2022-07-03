import { useEffect, useRef } from "react"
import L from "leaflet"

import "leaflet/dist/leaflet.css"
import "./leaflet-overrides.css"

function Map({ markers, onMarkerAdded }) {
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const polylinesRef = useRef([])

  useEffect(() => {
    const container = L.DomUtil.get("map")

    if (container != null) {
      container._leaflet_id = null
    }

    mapRef.current = L.map("map").setView([27.98785, 86.925026], 13)

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        updateWhenZooming: false,
        accessToken: import.meta.env.VITE_OSM_ACCESS_TOKEN,
      }
    ).addTo(mapRef.current)
  }, [])

  useEffect(() => {
    const map = mapRef.current

    function onMarkerAddedEventListener(e) {
      onMarkerAdded({ lat: e.latlng.lat, lng: e.latlng.lng })
    }

    map.on("click", onMarkerAddedEventListener)

    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => marker.remove())
      polylinesRef.current.forEach((polyline) => polyline.remove())
    }

    const mapMarkers = markers.map((marker, i) => {
      const numberIcon = L.divIcon({
        iconSize: [25, 41],
        iconAnchor: [18, 22],
        html: `${i + 1}`,
      })

      const mapMarker = L.marker(marker, { icon: numberIcon, id: i }).addTo(map)
      mapMarker.bindTooltip(marker.title)

      return mapMarker
    })

    markersRef.current = mapMarkers

    for (let i = 0; i < mapMarkers.length - 1; i++) {
      const polyline = L.polyline(
        [mapMarkers[i].getLatLng(), mapMarkers[i + 1].getLatLng()],
        {
          color: "#1086e8",
          weight: 7,
        }
      ).addTo(map)

      polylinesRef.current.push(polyline)
    }

    return () => {
      map.removeEventListener("click", onMarkerAddedEventListener)
    }
  }, [markers])

  return <div id="map"></div>
}

export default Map
