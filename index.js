// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');

// const app = express();
// const port = process.env.PORT ||  3000;

// const fs = require('fs');

// // Create the uploads directory if it doesn't exist
// const uploadsDirectory = './uploads/';
// if (!fs.existsSync(uploadsDirectory)){
//   fs.mkdirSync(uploadsDirectory);
// }

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://fuzailzaman:a01yliF3xvgJnVWr@practice.3jxg4to.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(
//     () => 
//     console.log('DataBase Connected Successfully'));

// // Create a MongoDB schema for the data
// const schema = new mongoose.Schema({
//   code: String,
//   description: String,
//   status: String,
//   role: String,
//   codePreviewImage: [String]
// });

// // Create a MongoDB model based on the schema
// const Model = mongoose.model('Model', schema);

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   },
//   fileFilter: fileFilter
// });

// app.use(express.json());

// // Handle GET requests
// app.get('/', async (req, res) => {
//   const data = await Model.find();
//   res.send(data);
// });

// // Handle POST requests
// app.post('/', upload.array('codePreviewImage', 10), async (req, res) => {
//   const images = req.files.map(file => file.path);
//   for (const key in images) {
//   console.log(key.file)
//   }
//   const data = new Model({
//     code: req.body.code,
//     description: req.body.description,
//     status: req.body.status,
//     role: req.body.role,
//     codePreviewImage: images
//   });
//   await data.save();
//   res.send(data);
// });

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });













const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT ||  3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDirectory = './uploads/';
    if (!fs.existsSync(uploadsDirectory)){
      fs.mkdirSync(uploadsDirectory);
    }
    cb(null, uploadsDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedFileTypes = ['.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname);
    if (allowedFileTypes.indexOf(ext) === -1) {
      return cb(new Error('Invalid file type, only .png, .jpg, and .jpeg are allowed.'));
    }
    cb(null, true);
  }
});

// Define a MongoDB schema for the onboarding data
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://fuzailzaman:a01yliF3xvgJnVWr@practice.3jxg4to.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
const onboardingSchema = new mongoose.Schema({
  code: String,
  description: String,
  status: String,
  role: String,
  codePreviewImage: String
});
const Onboarding = mongoose.model('Onboarding', onboardingSchema);

// Route for POST requests to create new onboarding data
app.post('/onboardings', upload.single('codePreviewImage'), function (req, res) {
  const onboarding = new Onboarding({
    code: req.body.code,
    description: req.body.description,
    status: req.body.status,
    role: req.body.role,
    codePreviewImage: req.file.filename
  });

  onboarding.save(function (err , onboarding) {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(onboarding);
  });
});




// Route for GET requests to retrieve all onboarding data
app.get('/onboardings', function (req, res) {
  Onboarding.find({}, function (err, onboardings) {
    if (err) {
      return res.status(500).send(err);
    }
    for (let i = 0; i < onboardings.length; i++) {
      onboardings[i].codePreviewImage = `http://localhost:3000/uploads/${onboardings[i].codePreviewImage}`;
    }
    res.send(onboardings);
  });
});


app.listen(port, function () {
  console.log(`Onboarding app listening on port 3000!`);
});
