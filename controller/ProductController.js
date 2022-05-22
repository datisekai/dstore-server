import db from "../database/index.js";
import convert from "../utils/ConvertArray.js";
import groupBy from "../utils/GroupBy.js";

const getAllProduct = async (req, res) => {
  const sql = `select product.id, product.name,product.prices, product.image, product.isActive, product.createdAt, category.name as nameCategory, category.id as idCategory from product, category, detailproduct
    where product.id = detailproduct.idProduct and detailproduct.idCategory = category.id`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }

    let products = [];
    const data = convert(result);
    data.forEach((item) => {
      const isFound = products.some((product) => item.id === product.id);
      if (!isFound) {
        products.push({
          ...item,
          idCategory: undefined,
          nameCategory: undefined,
          categories: [{ id: item.idCategory, name: item.nameCategory }],
        });
      } else {
        products = products.map((product) => {
          if (item.id === product.id) {
            return {
              ...product,
              categories: [
                ...product.categories,
                { id: item.idCategory, name: item.nameCategory },
              ],
            };
          }
          return product;
        });
      }
    });

    return res.json({ success: true, product: products });
  });
};

const getProduct = (req, res) => {
  const id = req.params.id;
  const sql = `select product.id, product.name, product.prices, product.image, product.isActive, product.createdAt, category.id as idCategory, category.name as nameCategory from product, category, detailproduct where product.id = detailproduct.idProduct and category.id = detailproduct.idCategory and product.id = ${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }
    const data = convert(result);
    const categories = data.map((item) => ({
      id: item.idCategory,
      name: item.nameCategory,
    }));
    return res.json({
      success: true,
      product: {
        ...data[0],
        idCategory: undefined,
        nameCategory: undefined,
        categories,
      },
    });
  });
};

const addProduct = (req, res) => {
  const { name, prices, image, categories } = req.body;
  if (!name || !prices || !image || !categories) {
    return res
      .status(404)
      .json({ success: false, message: "Must be enter full field" });
  }

  const current = new Date().getTime();
  const sql = `insert into product values (0,'${name}',${prices},'${image}',1,'${current}')`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }
    return res.json({ success: true, message: "Add successfull" });
  });

  const getIdCurrent = `select id from product where image like '${image}' order by id desc limit 1`;
  db.query(getIdCurrent, (err, result) => {
    const data = convert(result);

    categories.map((item) => {
      const sql = `insert into detailproduct values(${data[0].id},${item})`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ success: false, message: "Internal server" });
        }
      });
    });
  });
};

const deleteProduct = (req, res) => {
  const id = req.params.id;

  const sql = `update product set isActive = 0 where id = ${id}`;
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

const updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, prices, image, categories } = req.body;
  if (!name || !prices || !image || !categories) {
    return res
      .status(404)
      .json({ success: false, message: "Must be enter full field" });
  }

  const sql = `update product set name='${name}', prices=${prices}, image='${image}' where id = ${id}`;
  const deleteDetail = `delete from detailproduct where idProduct = ${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }
    return res.json({ success: true, message: "Update successfull" });
  });

  db.query(deleteDetail, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server" });
    }
  });
  categories.map((item) => {
    const sql = `insert into detailproduct values(${id},${item})`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server" });
      }
    });
  });
};

export { getAllProduct, getProduct, deleteProduct, addProduct, updateProduct };
