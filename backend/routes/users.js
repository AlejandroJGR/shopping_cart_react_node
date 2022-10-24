const { User } = require("../models/user");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");
const bcrypt = require ('bcrypt');

const router = require("express").Router();

//Create an user
router.post("/", isAdmin, async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
        const user = new User({
          name,
          email,
          password,
          isAdmin,
        })
        const savedUser = await user.save()

        res.status(200).send(savedUser);
      } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});


//Get All Users
router.get("/", isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Get User
router.get("/find/:id", isUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

//Update User
router.put("/:id", isUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!(user.email === req.body.email)) {
      const emailInUse = await User.findOne({ email: req.body.email });
      if (emailInUse)
        return res.status(400).send("That email is already in use");
    }
    if (req.body.password && user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      user.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        password: user.password,
      },
      { new: true }
    );
    res.status(200).send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (err) {
    res.status(500).send(err)
  }
});

//Delete
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    res.status(200).send(deletedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Get User Stats
router.get("/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("DD-MM-YYYY HH:mm:ss");

  try {
    const users = await User.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: {
          month: { $month: "$createdAt" }
        }
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 }
        }
      }
    ]);
    res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

});

module.exports = router; 