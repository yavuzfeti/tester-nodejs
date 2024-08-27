import express from "express"
import multer from 'multer';
import postgresClient from "../config/db.js"
import path from 'path';

const router = express.Router()

router.get("/" , (req,res) =>
{
    res.send("İmages");
});

// Resim yüklemek için multer ayarlarını yapılandırın
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploadImages/'); // Resimlerin yükleneceği klasör
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Resmin orijinal adını kullanın
    },
  });
  const upload = multer({ storage: storage });
  
  // POST isteği alındığında resmi kaydetmek için rota tanımlayın
  router.post('/upload', upload.single('image'), (req, res) => {
    const image = req.file; // Yüklenen resim dosyası
  
    // Resmi kaydetmek için sorgu oluşturun
    const query = 'INSERT INTO images (name, path) VALUES ($1, $2) RETURNING id';
    const values = [image.originalname, image.path];
  
    // Sorguyu PostgreSQL'e gönderin
    postgresClient.query(query, values, (err, result) => {
      if (err) {
        console.error('Resim kaydedilirken hata oluştu:', err);
        res.status(500).send('Bir hata oluştu.');
      } else {
        const imageId = result.rows[0].id;
        const imageUrl = `http://localhost:8080/images/show/${imageId}`; // Resmin tarayıcıda gösterileceği adres
        res.send(`Resim başarıyla kaydedildi. Göstermek için URL: ${imageUrl}`);
      }
  
      //postgresClient.end(); // PostgreSQL bağlantısını kapatın
    });
  });
  
  // Resmi tarayıcıda göstermek için ayrı bir rota tanımlayın
  router.get('/show/:id', (req, res) => {
    const imageId = req.params.id;
  
    // Resim yolunu almak için sorgu oluşturun
    const query = 'SELECT path FROM images WHERE id = $1';
    const values = [imageId];
  
    // Sorguyu PostgreSQL'e gönderin
    postgresClient.query(query, values, (err, result) => {
      if (err) {
        console.error('Resim alınırken hata oluştu:', err);
        res.status(500).send('Bir hata oluştu.');
      } else {
        if (result.rows.length === 0) {
          res.status(404).send('Resim bulunamadı.');
        } else {
            const imagePath = result.rows[0].path;
            const absolutePath = path.resolve(imagePath);
            res.sendFile(absolutePath);
        }
      }
  
      //postgresClient.end(); // PostgreSQL bağlantısını kapatın
    });
  });

export default router