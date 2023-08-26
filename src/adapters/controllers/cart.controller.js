const validator = require('validator');

const GetCart = require('@use_cases/cart/GetCart');
const AddProductToCart = require('@use_cases/cart/AddProductToCart');
const CreateCart = require('@use_cases/cart/CreateCart');

module.exports = (dependecies) => {
  const { cartRepository } = dependecies.DatabaseService;
  const getCart = async (req, res, next) => {
    try {
      let cartId = null;
      if (req.cookies.cart_id != undefined) {
        if (isNaN(req.cookies.cart_id)) {
          return res.status(400).json({ success: false, error: "ID корзины некорректен" })
        } else {
          cartId = req.cookies.cart_id;
        }
      } else if (req.query.cart_id != undefined) {
        if (isNaN(req.query.cart_id)) {
          return res.status(400).json({ success: false, error: "ID корзины некорректен" })
        } else {
          cartId = req.query.cart_id;
        }
      } else {
        return res.status(400).json({ success: false, error: "ID корзины должен быть отправлен" })
      }
      let cartToken = null;
      if (req.cookies.cart_token != undefined) {
        cartToken = req.cookies.cart_token;
      } else if (req.query.cart_token != undefined) {
        cartToken = req.query.cart_token;
      } else {
        return res.status(400).json({ success: false, error: "ID корзины должен быть отправлен" })
      }
      if (cartToken == null || cartId == null) {
        return res.status(400).json({ success: false, error: "Ошибка чтения" })
      } else if (!validator.matches(cartToken, '^[0-9a-zA-Z]{6}$')) {
        return res.status(400).json({ success: false, error: "Токен корзины некорректен" })
      } else {
        const GetCartCommand = GetCart(cartRepository);
        const response = await GetCartCommand(req.query.type, cartToken, cartId)
        return { success: true, ...response };
      }
    } catch (err) {
      next({ success: false, error: err });
    }
  }
  const addProductToCart = async (req, res, next) => {
    try {
      var cartId = null;
      if (req.cookies.cart_id != undefined) {
        if (isNaN(req.cookies.cart_id)) {
          return res.status(400).json({ success: false, error: "ID корзины некорректен" });
        } else {
          cartId = req.cookies.cart_id;
        }
      } else if (req.body.cart_id != undefined) {
        if (isNaN(req.body.cart_id)) {
          return res.status(400).json({ success: false, error: "ID корзины некорректен" });
        } else {
          cartId = req.body.cart_id;
        }
      } else {
        return res.status(400).json({ success: false, error: "ID корзины должен быть отправлен" });
      }
      var cartToken = null;
      if (req.cookies.cart_token != undefined) {
        cartToken = req.cookies.cart_token;
      } else if (req.body.cart_token != undefined) {
        cartToken = req.body.cart_token;
      } else {
        return res.status(400).json({ success: false, error: "ID корзины должен быть отправлен" });
      }
      if (cartToken == null || cartId == null) {
        return res.status(400).json({ success: false, error: "Ошибка чтения" });
      } else if (!validator.matches(cartToken, '^[0-9a-zA-Z]{6}$')) {
        return res.status(400).json({ success: false, error: "Токен корзины некорректен" });
      } else {
        const AddProductToCartCommand = AddProductToCart(cartRepository);
        await AddProductToCartCommand(req.body.cart, cartToken, cartId);
        return { success: true };
      }
    } catch (err) {
      next({ success: false, error: err });
    }
  }
  const createCart = async (req, res, next) => {
    try {
      if (req.body.goodId == undefined) {
        return res.status(400).json({ success: false, error: "ID товара должен быть отправлен" })
      } else if (isNaN(req.body.goodId)) {
        return res.status(400).json({ success: false, error: "ID товара некорректен" })
      } else {
        const CreateCartCommand = CreateCart(cartRepository);
        const response = await CreateCartCommand(req.body.goodId);
        return { success: true, ...response };
      }
    } catch (err) {
      next({ success: false, error: err });
    }
  }
  return {
    getCart,
    addProductToCart,
    createCart,
  }
}