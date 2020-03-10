import React, { useState } from 'react'
import DeckGL from '@deck.gl/react'
import { ScatterplotLayer } from '@deck.gl/layers'
import { StaticMap } from 'react-map-gl'
import { MAPBOX_ACCESS_TOKEN } from './secret'
import './App.css'
import 'mapbox-gl/dist/mapbox-gl.css'

function bytesToCoordinatesArray(buffer) {
  const dataView = new DataView(buffer)
  const doubleByteLen = 8
  let arr = []
  for (let i = 0; i < dataView.byteLength; i += doubleByteLen) {
    arr.push([dataView.getFloat64(i), dataView.getFloat64(i += doubleByteLen)])
  }
  return arr
}

function websocketTransfer(count, setData, shouldRenderData) {
  const socket = new WebSocket('ws://localhost:9000/ws')
  socket.onopen = e => {
    const buffer = new ArrayBuffer(4)  // Java int is 4 bytes
    const view = new DataView(buffer)
    view.setInt32(0, count, false)  // big-endian
    socket.send(buffer)
    socket.onmessage = e => {
      e.data.arrayBuffer().then(buffer => {
        socket.close()
        if (shouldRenderData) {
          setData(bytesToCoordinatesArray(buffer))
        }
      })
    }
  }
}

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
  const [shouldRenderData, setShouldRenderData] = useState(false)

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
        <label>Number of data points to request: </label>
        <input
          type="number"
          id="num-data-request"
          min="0"
          value={dataPointsCount}
          onChange={e => setDataPointsCount(Number(e.target.value))}
        />

        <button onClick={
          async e => {
            const data = await (await fetch(`http://localhost:9000/dataPoints?count=${dataPointsCount}`)).json()
            if (shouldRenderData) {
              setData(data['latlons'])
            }
          }
        } disabled={true}>Get Data Points</button>

        <button onClick={
          async e => {
            const buffer = await (await fetch(`http://localhost:9000/binDataPoints?count=${dataPointsCount}`)).arrayBuffer()
            if (shouldRenderData) {
              setData(bytesToCoordinatesArray(buffer))
            }
          }
        }>Get Data Points in Binary</button>

        <button onClick={
          e => websocketTransfer(dataPointsCount, setData, shouldRenderData)
        } disabled={true}>Get Data via WebSocket</button>

        <button onClick={e => setData([])}>Clear Data Points</button>
        
        <input
          type="checkbox"
          checked={shouldRenderData}
          onChange={e => setShouldRenderData(!shouldRenderData)}
        />
        <label>Render data</label>
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
