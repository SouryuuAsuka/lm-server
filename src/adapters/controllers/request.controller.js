const validator = require('validator');

const ConfirmRequest = require('@use_cases/request/ConfirmRequest');
const GetRequest = require('@use_cases/request/GetRequest');
const GetRequestList = require('@use_cases/request/GetRequestList');
const SetRequestComment = require('@use_cases/request/SetRequestComment');

module.exports = (dependecies) => {
  const { requestRepository, userRepository } = dependecies.DatabaseService;
  const confirmRequest = async (req, res, next) => {
    try {
      if (req.params.requestId == undefined) {
        return res.status(401).json({ error: true, message: 'Unauthorized access.' });
      } else if (!res.locals.isAdmin) {
        return res.status(401).json({ error: true, message: 'Недостаточно прав для редактирования оранизации' });
      } else {
        const ConfirmRequestCommand = ConfirmRequest(requestRepository, userRepository);
        const response = await ConfirmRequestCommand(req.params.requestId);
        return res.json(response);
      }
    } catch (err) {
      next({ error: true, message: err });
    }
  }
  const getRequest = async (req, res, next) => {
    try {
      if (req.params.requestId == undefined) {
        return res.status(401).json({ error: true, message: 'Unauthorized access.' });
      } else if (!res.locals.isAdmin) {
        return res.status(401).json({ error: true, message: 'Недостаточно прав для редактирования оранизации' });
      } else {
        const GetRequestCommand = GetRequest(requestRepository, userRepository);
        const response = await GetRequestCommand(req.params.requestId);
        return res.json(response);
      }
    } catch (err) {
      next({ error: true, message: err });
    }
  }
  const getRequestList = async (req, res, next) => {
    try {
      if (!res.locals.isAdmin) {
        return res.status(401).json({ error: true, message: 'Недостаточно прав для редактирования оранизации' });
      } else {
        const GetRequestListCommand = GetRequestList(requestRepository, userRepository);
        const response = await GetRequestListCommand(req.query.p);
        return res.json({ orgs: response });
      }
    } catch (err) {
      next({ error: true, message: err });
    }
  }
  const setRequestComment = async (req, res, next) => {
    try {
      if (req.params.requestId == undefined) {
        return res.status(401).json({ error: true, message: 'Unauthorized access.' });
      } else if (req.body.comment == undefined) {
        return res.status(401).json({ error: true, message: 'Empty comment' });
      } else if (!res.locals.isAdmin) {
        return res.status(401).json({ error: true, message: 'Недостаточно прав для редактирования оранизации' });
      } else {
        const SetRequestCommentCommand = SetRequestComment(requestRepository);
        await SetRequestCommentCommand(req.query.p);
        return res.json({});
      }
    } catch (err) {
      next({ error: true, message: err });
    }
  }
  return {
    confirmRequest,
    getRequest,
    getRequestList,
    setRequestComment,
  }
}