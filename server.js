// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const http = require('http');
// const os = require('os');
// const cluster = require('cluster');
// const { initSocket } = require('./utils/socket');
// const authRoutes = require('./routes/authRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const groupRoutes = require('./routes/groupRoutes');
// const { upload } = require('./utils/storage');
// const { authMiddleware } = require('./utils/middleware');

// const numCPUs = os.cpus().length;
// console.log(numCPUs);

// if (cluster.isMaster) {
//   // Fork workers
//   console.log(`Master ${process.pid} is running`);
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork(); // Fork a new worker if one dies
//   });
// } else {
//   const app = express();
//   const server = http.createServer(app);
//   initSocket(server);

//   app.use(express.json());

//   app.use('/api/auth', authRoutes);
//   app.use('/api/chat', chatRoutes);
//   app.use('/api/group', groupRoutes);
//   app.post('/api/upload', authMiddleware, upload.single('media'), (req, res) => {
//     res.status(200).json({ mediaUrl: `/resources/${req.file.mimetype.split('/')[0]}s/${req.file.filename}` });
//   });

//   mongoose.connect(process.env.MONGODB_URI)
//     .then(() => server.listen(process.env.PORT, () => {
//       console.log(`Worker ${process.pid} is listening on port ${process.env.PORT}`);
//     }))
//     .catch(error => console.error(error));

//   module.exports = app;
// }



// ===================================================================================================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { initSocket } = require('./utils/socket');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');
const { upload } = require('./utils/storage');
const { authMiddleware } = require('./utils/middleware');

const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/group', groupRoutes);
app.post('/api/upload', authMiddleware, upload.single('media'), (req, res) => {
  res.status(200).json({ mediaUrl: `/resources/${req.file.mimetype.split('/')[0]}s/${req.file.filename}` });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
  .catch(error => console.error(error));

module.exports = app;
