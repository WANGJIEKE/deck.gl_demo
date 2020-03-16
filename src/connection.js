import { HOST } from './config'

const doubleByteLen = 8

function bytesToCoordinatesArray(buffer) {
  const dataView = new DataView(buffer)
  let arr = []
  for (let i = 0; i < dataView.byteLength; i += doubleByteLen) {
    arr.push([dataView.getFloat64(i), dataView.getFloat64(i += doubleByteLen)])
  }
  return arr
}

export function websocketTransfer(count, setData, shouldRenderData) {
  const socket = new WebSocket(`ws://${HOST}:9000/ws`)
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

export async function JSONTransfer(count, setData, shouldRenderData) {
  const data = await (await fetch(`http://${HOST}/dataPoints?count=${count}`)).json()
  if (shouldRenderData) {
    setData(data['latlons'])
  }
}

export async function binTransfer(count, setData, shouldRenderData) {
  const buffer = await (await fetch(`http://${HOST}:9000/binDataPoints?count=${count}`)).arrayBuffer()
  if (shouldRenderData) {
    setData(bytesToCoordinatesArray(buffer))
  }
}
