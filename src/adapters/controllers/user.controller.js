const validator = require('validator');

const GetUser = require('@use_cases/user/GetUser');
const GetUserByUsername = require('@use_cases/user/GetUserByUsername');
const GetOrgListByUsername = require('@use_cases/user/GetOrgListByUsername');
const Signin = require('@use_cases/user/Signin');
const Signup = require('@use_cases/user/Signup');
const Signout = require('@use_cases/user/Signout');
const RefreshToken = require('@use_cases/user/RefreshToken');
const ConfirmEmail = require('@use_cases/user/ConfirmEmail');

module.exports = (dependecies) => {
  const { userRepository } = dependecies.DatabaseService;
  const { userComparer } = dependecies.CryproService;
  const { jwtEncrypter } = dependecies.JwtService;
  const { userTrasporter } = dependecies.MailService;
  const getUserByUsername = async (req, res, next) => {
    try {
      if (req.params.username == undefined) {
        return res.status(500).json({ error: true, message: 'Пустой запрос' });
      } else {
        const GetUserByUsernameCommand = GetUserByUsername(userRepository);
        const response = await GetUserByUsernameCommand(req.params.username);
        return res.json({ profile: response });
      }
    } catch (err) {
      next({ error: true, message: err });
    } GetUser
  }
  const getUser = async (req, res, next) => {
    try {
      if (res.locals.isAuth === false) {
        return res.status(500).json({ error: true, message: 'Пустой запрос' });
      } else {
        const GetUserCommand = GetUser(userRepository);
        const response = await GetUserCommand(res.locals.userId);
        return res.json({ user: response });
      }
    } catch (err) {
      next({ error: true, message: err });
    }
  }
  const getOrgListByUsername = async (req, res, next) => {
    try {
      const GetOrgListByUsernameCommand = GetOrgListByUsername(userRepository);
      const response = await GetOrgListByUsernameCommand(req.params.username, req.query.p, req.query.c, req.query.t);
      return res.json(response);
    } catch (err) {
      next({ error: true, message: err });
    }
  }
  const signin = async (req, res, next) => {
    try {
      let type;
      const login = req.body.login;
      if (validator.isEmail(login)) {
        type = 'email';
      } else if (validator.matches(login, '^[a-zA-Z0-9_.-]*$')) {
        type = 'username';
      } else {
        throw 'Username некорректен'
      }
      const SigninCommand = Signin(userRepository, userComparer, jwtEncrypter);
      const { accessToken, refreshToken, profileLink } = await SigninCommand(login, req.body.password, req.ip, type);
      console.log(JSON.stringify({ accessToken: accessToken, refreshToken: refreshToken, profileLink: profileLink }))
      res.cookie('accessToken', accessToken, {
        domain: "lampymarket.com",
      })
      res.cookie('refreshToken', refreshToken, {
        domain: "lampymarket.com",
      })
      return res.status(200).json({ success: true, profile: profileLink });
    } catch (err) {
      next({ error: err });
    }
  }
  const signup = async (req, res, next) => {
    try {
      //TODO: прописать blacklist из зарезервированных username
      if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ success: false, error: "Некорректный Email" })
      } else if (validator.isEmpty(req.body.username)) {
        return res.status(400).json({ success: false, error: "Заполните поле Username" })
      } else if (!validator.matches(req.body.username, '^[a-zA-Z0-9_.-]*$')) {
        return res.status(400).json({ success: false, error: "Username содержит некорректные символы" })
      } else if (!validator.isStrongPassword(req.body.password)) {
        return res.status(400).json({ success: false, error: "Некорректный пароль" })
      } else {
        const SignupCommand = Signup(userRepository, userComparer, userTrasporter);
        await SignupCommand(req.body.username, req.body.password, req.body.email);
        return res.status(200).json({ success: true });
      }
    } catch (err) {
      next({ success: false, error: err });
    }
  }
  const signout = async (req, res, next) => {
    try {
      if (res.locals.isAuth) {
        return res.status(401).json({ error: true, message: 'Unauthorized access.' });
      } else {
        const SignoutCommand = Signout(userRepository, jwtEncrypter);
        await SignoutCommand(res.locals.userId, req.cookies.refreshToken);
        return res.status(200).clearCookie('accessToken', { httpOnly: true }).clearCookie('refreshToken', { httpOnly: true }).json({ error: "" });
      }
    } catch (err) {
      next({ error: err });
    }
  }
  const refreshToken = async (req, res, next) => {
    try {
      if(req.cookies.refreshToken === undefined) throw "Unauthorized access.";
      const RefreshTokenCommand = RefreshToken(userRepository, userComparer, userTrasporter);
      const { refreshToken, accessToken } = await RefreshTokenCommand(req.cookies.refreshToken, req.ip);
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
      })
      return res.status(200).json({ error: "" });
    } catch (err) {
      next({ error: err });
    }
  }
  const confirmEmail = async (req, res, next) => {
    try {
      var mailClientKey = req.body.k;
      var mailClientToken = req.body.t;
      if (!validator.matches(mailClientToken, '^[a-zA-Z0-9]*$')) {
        res.status(400).json({ error: "Некорректные ключ валидации" })
      } else if (!validator.matches(mailClientKey, '^[a-zA-Z0-9]*$')) {
        res.status(400).json({ error: "Некорректные ключ валидации" })
      } else {
        const ConfirmEmailCommand = ConfirmEmail(userRepository, userComparer, jwtEncrypter);
        const { accessToken, refreshToken, profileLink } = await ConfirmEmailCommand(mailClientToken, mailClientKey, req.ip);
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
        })
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
        })
        return res.json({ profile: profileLink })
      }
    } catch (err) {
      next({ error: err });
    }
  }
  return {
    getUserByUsername,
    getUser,
    getOrgListByUsername,
    signin,
    signup,
    signout,
    refreshToken,
    confirmEmail,
  }
}