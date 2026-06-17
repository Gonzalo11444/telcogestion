const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Transporter creado UNA sola vez al arrancar — no en cada petición
const transporter = nodemailer.createTransport({
  host:   'smtppro.zoho.eu',
  port:   465,
  secure: true,
  auth: {
    user: 'info@telcogestion.es',
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  // Aumentar timeouts SMTP para que no corte antes que el fetch del cliente
  connectionTimeout: 20000,   // 20s para conectar al servidor SMTP
  greetingTimeout:   15000,   // 15s para el saludo SMTP
  socketTimeout:     30000,   // 30s de inactividad en el socket
});

app.get('/', (req, res) => {
  res.send('Servidor backend de TelcoGestion funcionando.');
});

app.post('/send', async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body;

  // Validación básica
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
  }

  try {
    await transporter.sendMail({
      from:    '"Formulario TelcoGestion" <info@telcogestion.es>',
      to:      'info@telcogestion.es',
      subject: `Nuevo mensaje de ${nombre}`,
      text: `Nombre:    ${nombre}\nEmail:     ${email}\nTeléfono:  ${telefono || '—'}\nMensaje:\n${mensaje}`,
      html: `
        <h2 style="color:#0B1F3A">Nuevo mensaje desde TelcoGestión</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
          <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Nombre</td><td style="padding:6px 12px">${nombre}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Email</td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Teléfono</td><td style="padding:6px 12px">${telefono || '—'}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;color:#555;vertical-align:top">Mensaje</td><td style="padding:6px 12px">${mensaje.replace(/\n/g, '<br>')}</td></tr>
        </table>
      `,
    });

    res.status(200).json({ success: true, message: 'Correo enviado correctamente.' });

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el correo. Inténtalo de nuevo.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});