const express = require('express');
const router = express.Router();

const appInit = require('@middleware/appInit');

const userControllerCreate = require("@controllers/user.controller");

const userRouter = (dependencies) => {
  const userController = userControllerCreate(dependencies);
  router.use(appInit);
  
  router.post('/signin', userController.signin);
  router.post('/signup', userController.signup);
  router.post('/confirm-email', userController.confirmEmail);
  router.get('/token', userController.refreshToken);
  router.delete('/token', userController.signout);

  router.get('/', userController.getUser);
  router.get('/:username', userController.getUserByUsername);
  router.get('/:username/orgs', userController.getOrgListByUsername);

  return router;
}

module.exports = userRouter;
