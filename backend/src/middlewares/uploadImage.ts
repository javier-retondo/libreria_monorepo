import multer from 'multer';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = join(__dirname, '..', '..', 'public', 'img');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const uniqueName = `${Date.now()}.${ext}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage }).single('imagen');

export const handleImageUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: true,
        status: 400,
        body: 'Error al subir la imagen',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: true,
        status: 400,
        body: 'No se proporcionó ninguna imagen',
      });
    }
    req.body.imagen_url = `/static/img/${req.file.filename}`;
    next();
  });
};
