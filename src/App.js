import React, { useState } from 'react'
import DeckGL from '@deck.gl/react'
import { ScatterplotLayer } from '@deck.gl/layers'
import { StaticMap } from 'react-map-gl'
import { MAPBOX_ACCESS_TOKEN } from './secret'
import './App.css'
import 'mapbox-gl/dist/mapbox-gl.css'

function App() {
  const initialViewState = {
    longitude: -122.123801,
    latitude: 37.893394,
    zoom: 13,
    pitch: 0,
    bearing: 0
  }

  const [data, setData] = useState([
    [-122.123801, 37.893394],
    [-122.271604, 37.803664]
  ])

  const [dataPointsCount, setDataPointsCount] = useState(10)
  const scatterplotLayerFactory = data => new ScatterplotLayer({
    id: 'sample-scatter-plot-layer',
    data: data.map(coord_pair => { return { coordinates: coord_pair } }),
    pickable: false,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 1,
    radiusMinPixels: 5,
    radiusMaxPixels: 5,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 1,
    getPosition: d => d.coordinates,
    getRadius: _ => 5,
    getFillColor: _ => [255, 140, 0],
    getLineColor: _ => [0, 0, 0],
  })

  return (
    <div className="App">
      <div id="data-point-control">
        <label># data request: </label>
        <input
          type="number"
          id="num-data-request"
          min="0"
          value={dataPointsCount}
          onChange={e => setDataPointsCount(Number(e.target.value))}
        />
        <button id="get-data-button" onClick={
          e => fetch(`http://localhost:9000/dataPoints?count=${dataPointsCount}`).then(
            response => response.json(), reason => alert(reason)
          ).then(data => setData(data['latlons']), reason => alert(reason))
        }>Get Data Points</button>
        <button id="get-data-button" onClick={
          e => fetch("http://localhost:9000")
        }>Get Data Points in Binary</button>
      </div>
      <div id="my-deckgl-map">
        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          layers={[scatterplotLayerFactory(data)]}
        >
          <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
        </DeckGL>
      </div>
    </div>
  )
}

export default App
