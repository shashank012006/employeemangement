const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://127.0.0.1:27017/dms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

const DocSchema = new mongoose.Schema({
  name: String,
  url: String
});

const User = mongoose.model('User', UserSchema);
const Doc = mongoose.model('Doc', DocSchema);

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  await user.save();
  res.send({ message: 'User registered' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) res.send({ message: 'Login successful' });
  else res.status(401).send({ message: 'Invalid credentials' });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post('/api/docs/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const doc = new Doc({ name: file.originalname, url: `http://localhost:5000/uploads/${file.filename}` });
  await doc.save();
  res.send({ message: 'File uploaded' });
});

app.get('/api/docs', async (req, res) => {
  const docs = await Doc.find();
  res.send(docs);
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));