const GetOrgList = require('@use_cases/org/GetOrgList');
const GetOwnerId = require('@use_cases/org/GetOwnerId');
const GetFullOrgById = require('@use_cases/org/GetFullOrgById');
const GetOrgById = require('@use_cases/org/GetOrgById');
const NewOrg = require('@use_cases/org/NewOrg');
const EditOrg = require('@use_cases/org/EditOrg');
const SetPublic = require('@use_cases/org/SetPublic');
const GetOrgQuestList = require('@use_cases/org/GetOrgQuestList');

const path = require("path");
const minioClient = require("@common/minio");
const validator = require('validator');
const sharp = require('sharp');

module.exports = (dependecies) => {
  const { orgRepository } = dependecies.DatabaseService;
  const getOrgList = async (req, res, next) => {
    try {
      const GetOrgListCommand = GetOrgList(orgRepository);
      const response = await GetOrgListCommand(req.query.p, req.query.c, req.query.t);
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
  const getOrgById = async (req, res, next) => {
    try {
      let fullAccess = false;
      if (res.locals.isAdmin) fullAccess = true;
      else if (res.locals.isAuth && (res.locals.userRole === 3 || res.locals.userRole === 4)) {
        const GetOwnerIdCommand = GetOwnerId(orgRepository);
        const owner = await GetOwnerIdCommand(req.params.orgId);
        if (owner === req.locals.userId) {
          fullAccess = true;
        }
      }
      const GetOrgByIdCommand = fullAccess ? GetFullOrgById(orgRepository) : GetOrgById(orgRepository);
      const org = GetOrgByIdCommand(req.params.orgId)
      res.json(org);
    } catch (err) {
      next(err);
    }
  }
  const createOrg = async (req, res, next) => {
    try {
      if (req.body.name == undefined) {
        return res.status(400).json({ success: false, error: "Название организации должно быть заполнено" })
      } else if (req.body.about == undefined) {
        return res.status(400).json({ success: false, error: "Описание организации должно быть заполнено" })
      } else if (req.body.category == undefined) {
        return res.status(400).json({ success: false, error: "Категория организации должно быть заполнено" })
      } else if (req.file.path == undefined) {
        return res.status(400).json({ success: false, error: "Аватар организации должен быть прикреплен" })
      } else if (req.body.country == undefined) {
        return res.status(400).json({ success: false, error: "Страна организации должна быть заполнена" })
      } else if (req.body.city == undefined) {
        return res.status(400).json({ success: false, error: "Город организации должно быть заполнено" })
      } else if (req.body.street == undefined) {
        return res.status(400).json({ success: false, error: "Улица организации должна быть заполнена" })
      } else if (req.body.house == undefined) {
        return res.status(400).json({ success: false, error: "Дом организации должно быть заполнено" })
      } else if (req.body.flat == undefined) {
        return res.status(400).json({ success: false, error: "Квартира/офис организации должно быть заполнено" })
      } else if (req.body.lang == undefined) {
        return res.status(400).json({ success: false, error: "Язык организации должен быть заполнен" })
      } else if (validator.isEmpty(req.body.name)) {
        return res.status(400).json({ success: false, error: "Название организации должно быть заполнено" })
      } else if (validator.isEmpty(req.body.about)) {
        return res.status(400).json({ success: false, error: "Описание организации должно быть заполнено" })
      } else if (validator.isEmpty(req.body.category)) {
        return res.status(400).json({ success: false, error: "Тип организации должен быть указан" })
      } else if (validator.isEmpty(req.body.city)) {
        return res.status(400).json({ success: false, error: "Город организации должен быть указан" })
      } else if (validator.isEmpty(req.body.street)) {
        return res.status(400).json({ success: false, error: "Улица организации должна быть указана" })
      } else if (validator.isEmpty(req.body.house)) {
        return res.status(400).json({ success: false, error: "Дом организации должен быть указан" })
      } else if (validator.isEmpty(req.body.flat)) {
        return res.status(400).json({ success: false, error: "Квартира/офис организации должен быть указан" })
      } else if (validator.isEmpty(req.body.country)) {
        return res.status(400).json({ success: false, error: "Страна организации должна быть указана" })
      } else if (validator.isEmpty(req.body.lang)) {
        return res.status(400).json({ success: false, error: "Язык организации должен быть указан" })
      } else if (!validator.matches(req.body.category, '^[012]{1,2}$')) {
        return res.status(400).json({ success: false, error: "Некорректный тип организации" })
      } else if (!validator.matches(req.body.city, '^[a-z]{3,4}$')) {
        return res.status(400).json({ success: false, error: "Некорректное значение города" })
      } else if (validator.isEmpty(req.file.path)) {
        return res.status(400).json({ success: false, error: "Аватар организации должен быть загружен" })
      } else {
        const NewOrgCommand = NewOrg(orgRepository);
        const response = await NewOrgCommand(req.body, res.locals.userId);
        if (!response === true) throw "Ошибка записи в базу данных";
        let image = sharp(req.file.path); // path to the stored image
        image.resize({ width: 720, height: 720 }).toFormat("jpeg", { mozjpeg: true }).toFile(
          path.resolve(req.file.destination, 'resized', req.file.filename)
        )  // get image metadata for size
          .then(function (metadata) { //TODO: Потом надо будет как-то нормально обрабатывать    изображения
            let metaData = {
              'Content-Type': 'image/jpeg',
            }
            minioClient.fPutObject(
              "avatars-org-request",
              orgRow.rows[0].org_id + ".jpeg",
              path.resolve(req.file.destination, 'resized', req.file.filename),
              metaData,
              (err, etag) => {
                if (err) {
                  console.log(err);
                  throw "Ошибка при сохранении изображения";
                } else return res.status(200).json({ success: true });
              }
              //TODO: Добавить удаление временных файлов
              //TODO: Добавить огранияение на количество заявок
              //TODO: Добавить rollback в случае ошибки
            );
          }).catch(err => {
            console.log("Ошибка сохранения файла. " + err)
            throw "Ошибка при сохранении изображения";
          })
      }
    } catch (err) {
      next({ success: false, error: err });
    }
  }
  const editOrg = async (req, res, next) => {
    try {
      if (req.body.name == undefined) {
        return res.status(400).json({ success: false, error: "Название организации должно быть заполнено" })
      } else if (req.body.about == undefined) {
        return res.status(400).json({ success: false, error: "Описание организации должно быть заполнено" })
      } else if (req.body.category == undefined) {
        return res.status(400).json({ success: false, error: "Категория организации должно быть заполнено" })
      } else if (req.body.city == undefined) {
        return res.status(400).json({ success: false, error: "Город организации должно быть заполнено" })
      } else if (!Array.isArray(req.body.name)) {
        return res.status(400).json({ success: false, error: "Название организации должно быть заполнено" })
      } else if (!Array.isArray(req.body.about)) {
        return res.status(400).json({ success: false, error: "Описание организации должно быть заполнено" })
      } else if (validator.isEmpty(req.body.category)) {
        return res.status(400).json({ success: false, error: "Тип организации должен быть указан" })
      } else if (validator.isEmpty(req.body.city)) {
        return res.status(400).json({ success: false, error: "Страна должна быть указана" })
      } else if (!validator.matches(req.body.category, '^[012]{1,2}$')) {
        return res.status(400).json({ success: false, error: "Некорректный тип организации" })
      } else if (!validator.matches(req.body.city, '^[a-z]{3,4}$')) {
        return res.status(400).json({ success: false, error: "Некорректное значение страны" })
      } else {
        let org = req.body;
        org.orgId = req.params.orgId
        const EditOrgCommand = EditOrg(orgRepository);
        const response = await EditOrgCommand(org, res.locals.userId);
        if (!response === true) throw "Ошибка записи в базу данных";
        if (req.file) {
          var image = sharp(req.file.path); // path to the stored image
          image.resize({ width: 720, height: 720 }).toFormat("jpeg", { mozjpeg: true }).toFile(
            path.resolve(req.file.destination, 'resized', req.file.filename)
          ).then(function () {
            var metaData = {
              'Content-Type': 'image/jpeg',
            }
            minioClient.fPutObject(
              "avatars-org",
              orgRow.rows[0].org_id + ".jpeg",
              path.resolve(req.file.destination, 'resized', req.file.filename),
              metaData,
              (err, etag) => {
                if (err) {
                  console.log(err);
                  return res.status(400).json({ success: false, error: "Ошибка при сохранении изображения" })
                } else return res.status(200).json({ success: true });
              }
              //TODO: Добавить удаление временных файлов
              //TODO: Добавить огранияение на количество заявок
              //TODO: Добавить rollback в случае ошибки
            );
          })
        } else {
          return res.status(200).json({ success: true });
        }
      }
    } catch (err) {
      next({ success: false, error: err });
    }
  }
  const setPublic = async (req, res, next) => {
    try {
      if (req.params.orgId == undefined) {
        return res.status(400).json({ success: false, error: "ID организации должно быть заполнено" })
      } else if (req.body.public == undefined) {
        return res.status(400).json({ success: false, error: "Статус организации должен быть заполнено" })
      } else if (isNaN(req.params.orgId)) {
        return res.status(400).json({ success: false, error: "ID организации заполнено некорректно" })
      } else {
        let org = req.body;
        org.orgId = req.params.orgId;
        const SetPublicCommand = SetPublic(orgRepository);
        if (res.locals.isAdmin) {
          await SetPublicCommand(req.body.public, req.params.orgId)
        } else {
          await SetPublicCommand(req.body.public, req.params.orgId, res.locals.userId)
        }
        return res.status(200).json({ success: true });
      }
    } catch (err) {
      next({ success: false, error: err });
    }
  }
  const getOrgQuestList = async (req, res, next) => {
    try {
      const GetOrgQuestListCommand = GetOrgQuestList(orgRepository);
      const response = await GetOrgQuestListCommand(res.locals.isAdmin, res.locals.userId, req.params.orgId, req.query.page, req.query.status, req.query.paid);
      return response;
    } catch (err) {
      next({ error: err });
    }
  }
  return {
    getOrgList,
    getOrgById,
    createOrg,
    editOrg,
    setPublic,
    getOrgQuestList,
  };
}