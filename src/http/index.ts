import express from 'express'

const app = express()

app.get('/', (_req, res) => {
  res.redirect('https://github.com/zhangzisu/windowsd-server')
})

export default app
