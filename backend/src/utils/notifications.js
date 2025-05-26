const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');

// Configuración de la conexión a la base de datos
const pool = new Pool({
    user: 'tu_usuario',
    host: 'localhost',
    database: 'agenda',
    password: 'tu_contraseña',
    port: 5432,
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tuemail@gmail.com',
        pass: 'tucontraseña'
    }
});

// Función para enviar correo de notificación
function sendEmailNotification(email, subject, message) {
    const mailOptions = {
        from: 'tuemail@gmail.com',
        to: email,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
}

// Función para agregar una notificación a la base de datos
async function addNotification(userId, message) {
    try {
        await pool.query(
            'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
            [userId, message]
        );
        console.log('Notificación agregada a la base de datos');
    } catch (error) {
        console.error('Error al agregar notificación:', error);
    }
}

// Tarea programada: Enviar notificaciones cada día a las 8 AM
cron.schedule('0 8 * * *', async () => {
    console.log('Enviando notificaciones de reuniones y tareas pendientes...');

    try {
        // Obtener notificaciones pendientes
        const result = await pool.query(
            `SELECT n.id, n.message, u.correo 
             FROM notifications n
             JOIN usuarios u ON n.user_id = u.id
             WHERE n.is_read = FALSE`
        );

        // Enviar notificaciones
        result.rows.forEach(row => {
            sendEmailNotification(row.correo, 'Recordatorio', row.message);
        });

        console.log('Notificaciones enviadas.');
    } catch (error) {
        console.error('Error al enviar notificaciones:', error);
    }
}, {
    timezone: 'America/Mexico_City'
});

module.exports = { addNotification };
