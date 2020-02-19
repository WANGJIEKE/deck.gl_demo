import React from 'react'
import DeckGL from '@deck.gl/react'
import { LineLayer } from '@deck.gl/layers'
import './App.css'

function App() {
  const viewState = {
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
      <DeckGL viewState={viewState} layers={layers} />
    </div>
  )
}

export default App
