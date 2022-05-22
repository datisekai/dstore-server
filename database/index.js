import mysql from "mysql";
import * as dotenv from "dotenv";
dotenv.config();
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.user,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql connected");
});

export default db;
