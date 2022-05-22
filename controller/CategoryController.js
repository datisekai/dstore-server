import db from "../database/index.js";
import convert from "../utils/ConvertArray.js";

const getAllCategory = (req, res) => {
  const limit = 4;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;
  const sql = `select * from category limit ${skip},${limit}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }
    db.query("select  count(id) as count from category", (err, result2) => {
      return res.json({
        success: true,
        category: result,
        total: convert(result2)[0].count,
      });
    });
  });
};

const addCategory = (req, res) => {
  const { name, image, desc, isSell } = req.body;
  if (!name || !image || !desc) {
    return res
      .status(404)
      .json({ success: false, message: "Must be enter full field" });
  }

  const current = new Date().getTime();
  const sql = `insert into category values (0,'${name}','${image}','${desc}','${isSell}','${current}')`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }
    const sql = `select * from category order by id desc limit 1`;
    db.query(sql, (err, result) => {
      console.log(result);
      return res.json({ success: true, category: result });
    });
  });
};

const updateCategory = (req, res) => {
  const { name, image, desc, isSell } = req.body;
  const id = req.params.id;
  if (!name || !image || !desc || !isSell) {
    return res
      .status(404)
      .json({ success: false, message: "Must be enter full field" });
  }
  const sql = `update category set name = '${name}', image= '${image}', desc = '${desc}', isSell=${isSell} where id = ${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }

    return res.json({ success: true, message: "Update successfull" });
  });
};

const deleteCategory = (req, res) => {
  const id = req.params.id;
  const sql = `update category set isSell = 0 where id = ${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }

    return res.json({ success: true, message: "Delete successfull" });
  });
};

const getCategory = (req, res) => {
  const id = req.params.id;
  const sql = `select * from category where id = ${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }
    const data = convert(result);
    const category = data.find((item) => item.id == id);
    return res.json({ success: true, category: category });
  });
};

const filterIDName = (req, res) => {
  const query = req.params.query;

  const sql = `select * from category where id = ${query} or name like '%${query}%'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(404)
        .json({ success: false, message: "Internal server" });
    }

    return res.json({ success: true, category: result });
  });
};

export {
  getAllCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  filterIDName,
};
