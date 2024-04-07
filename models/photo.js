'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    static associate(models) {
      // define association here
      Photo.belongsTo(models.Post, { foreignKey: 'post_id' }); // 오타 수정
    }
  }
  Photo.init({
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};