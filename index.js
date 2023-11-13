require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routers/auth.router'));
app.use('/api/users', require('./routers/user.router'));
app.use('/api/trainings', require('./routers/training.router'));

app.listen(process.env.PORT, async () => {
  try {
    console.log(`Server has started on port ${process.env.PORT}`);
  } catch (err) {
    console.log(`Somthing went wrong, error: ${err}`);
  }
});
