const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/send', async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body; // <-- nombres igual que en el formulario

  const transporter = nodemailer.createTransport({
    host: 'authsmtp.securemail.pro',
    port: 587,
    secure: true, // Usamos SSL/TLS
    auth: {
      user: 'info@telcogestion.es',
      pass: 'infotelcogestion!',
    },
    tls: {
      rejectUnauthorized: false  // <--- Evita error self-signed certificate
    }
  });

  try {
    await transporter.sendMail({
      from: `"Formulario TelcoGestion" <info@telcogestion.es>`,
      to: 'info@telcogestion.es',
      subject: 'Nuevo mensaje desde el formulario',
      text: `
Nombre: ${nombre}
Email: ${email}
Teléfono: ${telefono}
Mensaje: ${mensaje}
      `,
    });

    res.status(200).json({ success: true, message: 'Correo enviado correctamente.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ success: false, message: 'Hubo un error al enviar el correo.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});

app.get('/', (req, res) => {
  res.send('Servidor backend de TelcoGestion funcionando.');
});
