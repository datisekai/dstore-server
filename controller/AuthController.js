import db from "../database/index.js";
import md5 from "md5";
import convert from "../utils/ConvertArray.js";
import jwt from "jsonwebtoken";

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(404)
      .json({ success: false, message: "Must be enter full field" });
  }

  const sql = `select * from staff where email like '${email}' limit 1`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }

    const data = convert(result);
    const staff = data.find((item) => item.email == email);
    if (!staff) {
      return res
        .status(400)
        .json({ success: false, message: "Email or password incorrect" });
    }
    if (staff.isActive == 0) {
      return res
        .status(400)
        .json({ success: false, message: "Account is banned" });
    }
    if (staff.password === md5(password)) {
      const token = jwt.sign(
        {
          id: staff.id,
          isActive: staff.isActive,
          idControl: staff.idControl,
        },
        process.env.SECRET
      );

      return res.json({ success: true, token: token });
    }
  });
};

const getUser = (req, res) => {
  const userId = req.userId;

  const sql = `select * from staff where id = ${userId}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }
    const user = convert(result)[0];
    const sql = `select idTitle from detailcontrol where idControl = ${user.idControl}`;
    db.query(sql, (err, result) => {
      const controls = convert(result).map((item) => item.idTitle);
      return res.json({ success: true, user, controls });
    });
  });
};

export { login, getUser };
