const Minio = require('minio');
const minioClient = new Minio.Client({
    endPoint: 'lm-minio',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});
module.exports = minioClient;