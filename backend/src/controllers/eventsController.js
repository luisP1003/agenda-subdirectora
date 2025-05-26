const pool = require("../db");

// GET todos los eventos
exports.getAllEvents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM eventos ORDER BY fecha DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los eventos" });
  }
};

// POST nuevo evento
exports.createEvent = async (req, res) => {
  try {
    const {
      titulo, fecha, hora, lugar, objetivo,
      participantes_empresa, participantes_itt, participantes_alumnos,
      actividades
    } = req.body;

    const imagenes = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const result = await pool.query(
      `INSERT INTO eventos (
        titulo, fecha, hora, lugar, objetivo, 
        participantes_empresa, participantes_itt, participantes_alumnos, 
        actividades, imagenes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, $10::text[]) RETURNING *`,
      [
        titulo,
        fecha,
        hora,
        lugar,
        objetivo,
        participantes_empresa,
        participantes_itt,
        participantes_alumnos,
        actividades,
        imagenes
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear evento:", err);
    res.status(500).json({ error: "Error al crear el evento" });
  }
};

// PUT actualizar evento
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo, fecha, hora, lugar, objetivo,
      participantes_empresa, participantes_itt, participantes_alumnos,
      actividades
    } = req.body;

    let imagenes = [];
    if (req.files && req.files.length > 0) {
      imagenes = req.files.map((file) => `/uploads/${file.filename}`);
    } else {
      const existing = await pool.query("SELECT imagenes FROM eventos WHERE id = $1", [id]);
      imagenes = existing.rows[0]?.imagenes || [];
    }

    const result = await pool.query(
      `UPDATE eventos SET 
        titulo=$1, fecha=$2, hora=$3, lugar=$4, objetivo=$5,
        participantes_empresa=$6, participantes_itt=$7, participantes_alumnos=$8,
        actividades=$9, imagenes=$10::text[]
       WHERE id=$11 RETURNING *`,
      [
        titulo,
        fecha,
        hora,
        lugar,
        objetivo,
        participantes_empresa,
        participantes_itt,
        participantes_alumnos,
        actividades,
        imagenes,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar evento:", err);
    res.status(500).json({ error: "Error al actualizar el evento" });
  }
};

// DELETE eliminar evento
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM eventos WHERE id = $1", [id]);
    res.json({ message: "Evento eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el evento" });
  }
};
