const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Obtener el header de autorización
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Acceso denegado. No se proporcionó token." });
  }
  
  // Se espera que el header tenga el formato "Bearer <token>"
  const token = authHeader.split(" ")[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Se puede usar para identificar al usuario en rutas protegidas
    next();
  } catch (error) {
    return res.status(400).json({ message: "Token inválido." });
  }
};

module.exports = verifyToken;
