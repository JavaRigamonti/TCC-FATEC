const app = require('./app');

app.listen(process.env.PORT || 3333, () => {
  console.log(`[SERVER] Server running on port ${process.env.PORT || 3333}`);
});