const express = require("express");
const { authorizePermissions } = require("../middleware/authentication");
const {
  createOrder,
  getSingleOrder,
  updateOrder,
  getCurrentUserOrders,
  getAllOrders,
} = require("../controllers/orderController");
const router = express.Router();

router
  .route("/")
  .get(authorizePermissions("admin"), getAllOrders)
  .post(createOrder);

router.route("/showALlMyOrders").get(getCurrentUserOrders);

router.route("/:id").get(getSingleOrder).patch(updateOrder);

module.exports = router;
