process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/dbConfig';
import aiRouter from './routers/aiRouter';
import productRouter from './routers/productRouter';

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Serve images from the Client's public folder
app.use('/images', express.static(path.join(__dirname, '../../Client/public/images')));

app.get('/test', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/ai', aiRouter);
app.use('/api/products', productRouter);

app.get('/', (req, res) => {
  res.send('Server is running! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT} 🎈`);
});
