const express = require('express');
const app = express();
const conn = require("./config");
const multer = require('multer');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: true }));

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Read all data
app.get('/api/users', (req, res) => {
  const sql = "SELECT * FROM users";
  conn.query(sql, (err, result) => {
   if(err) throw err;
   res.json(result);
  });

}); 

// Data Insert
app.post('/api/user', upload.single('image'), (req, res) => {
  const {first_name, last_name} = req.body;
  const image = req.file.filename;
  
  const sql = "INSERT INTO users (first_name, last_name, image ) VALUES (? ,?, ?)";
  conn.query(sql, [first_name, last_name, image], (err, result) => {
   if(err) throw err;
   res.send('Data send Successfully!');
  });

});

// Data Update

app.put('/api/user/:id', upload.single('image'), (req, res) => {
  const { first_name, last_name } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;

  let sql = "UPDATE users SET first_name = ?, last_name = ?";
  const values = [ first_name, last_name ];

  if(image) {
    sql += ', image = ?';
    values.push(image);
  }
 
  sql += ' WHERE id = ?';
  values.push(id);

  conn.query(sql, values, (err, result) => {
    if(err) throw err;
    res.send('Data Updated Successfully!');

  });
});

// Data Delete 

app.delete('/api/user/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";
  conn.query(sql, [id], (err, result) => {
   if(err) throw err;
   res.send('Data Deleted!')
  });

});

app.listen(4000);