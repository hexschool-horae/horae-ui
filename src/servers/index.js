// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createServer } = require('http')
const express = require('express')
const next = require('next')
const { Server } = require('socket.io')
// References:
// - https://nextjs.org/docs/advanced-features/custom-server
// - https://github.com/vercel/next.js/tree/canary/examples/custom-server-express
// - https://github.com/websockets/ws

const port = 3050
// const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev: true })
const nextHandler = nextApp.getRequestHandler()

// mock 回應時間
const delay = (ms = 2000) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

nextApp.prepare().then(() => {
  // Express server - for handling incoming HTTP requests from Gravio
  const expressApp = express()

  expressApp.get('/', function (req, res) {
    res.send('Express is working on IISNode!')
  })

  // Node http server - added to for integrating WebSocket server
  const httpServer = createServer(expressApp)

  // WebSocket server - for sending realtime updates to UI
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      'Access-Control-Allow-Origin': '*',
    },
  })

  io.on('connect', socket => {
    console.log(new Date() + 'connection!')
    // 全域廣播

    socket.on('patchBoardPermisson', async arg => {
      await delay()
      socket.emit('onBoardPermisson', { isSuccess: true, message: '權限修改成功', data: arg })
    })

    socket.on('patchListOrder', async arg => {
      await delay()
      socket.emit('onListOrder', { isSuccess: true, message: '列表順序修改成功', data: arg })
    })

    socket.on('disconnect', function () {
      console.log('user disconnected')
    })
  })

  // To handle Next.js routing
  expressApp.all('*', (req, res) => {
    return nextHandler(req, res)
  })

  // Start the server!
  httpServer.listen(port, err => {
    if (err) throw new Error(err)
    console.log(`Ready on http://127.0.0.1:${port}`)
  })
})
