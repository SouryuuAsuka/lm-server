const path = require("path");
const sharp = require('sharp');

module.exports = class MinioAvatarRepository {
  constructor(minio) {
    this.minio = minio;
  }
  async savePicture(file, newFilename, repository) {
    try {
      let image = sharp(file.path); // path to the stored image
      await image.resize({ width: 720, height: 720 }).toFormat("jpeg", { mozjpeg: true }).toFile(
        path.resolve(file.destination, 'resized', file.filename)
      )
      const metaData = { 'Content-Type': 'image/jpeg' }
      await this.minio.fPutObject(
        repository,
        newFilename + ".jpeg",
        path.resolve(file.destination, 'resized', file.filename),
        metaData);
      return true;
    } catch (err) {
      console.log(err);
      throw "Ошибка при сохранении изображения";
    }
  }
}