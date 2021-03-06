import jwt from "jsonwebtoken";

const isLogin = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(400).json({
      success: false,
      message: "You must login!",
    });
  try {
    const detoken = jwt.verify(token, process.env.SECRET);
    req.userId = detoken.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({
      success: false,
      message: "Error Token",
    });
  }
};

export default isLogin;
