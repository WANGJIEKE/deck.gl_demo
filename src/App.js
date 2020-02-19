import React from 'react'
import DeckGL from '@deck.gl/react'
import { LineLayer } from '@deck.gl/layers'
import { StaticMap } from 'react-map-gl'
import './App.css'

function App() {
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoid2FuZ2ppZWtlIiwiYSI6ImNrNnNrcXI1NTA0ZDkzbXJ4bTZoaTh5N3EifQ.Cd1z1vGhBr1Vq5LPIfpNVA'

  const initialViewState = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 13,
    pitch: 0,
    bearing: 0
  }

  const data = [
    { sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] }
  ]

  const layers = [
    new LineLayer({ id: 'line-layer', data })
  ]

  return (
    <div className="App">
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    </div>
  )
}

export default App
