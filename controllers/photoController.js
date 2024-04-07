const { Post, Photo } = require('../models');
const fs = require('fs');
const path = require('path');

exports.deletePhoto = async (req, res) => {
    try {
        const photoId = req.params.id;
        // 먼저 삭제할 사진 정보를 조회합니다.
        const photo = await Photo.findByPk(photoId);

        if (!photo) {
            return res.status(404).json({ error: 'Photo not found' });
        }

        // 파일 시스템에서 사진 파일을 삭제합니다.
        const filePath = path.join(__dirname, '..', 'uploads', path.basename(photo.path));
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error('Failed to delete the photo file:', err);
                return res.status(500).json({ error: 'An error occurred while deleting the photo file' });
            }

            // 데이터베이스에서 사진 정보를 삭제합니다.
            await photo.destroy();
            res.json({ message: 'Photo deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the photo' });
    }
};