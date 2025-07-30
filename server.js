const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'authsmtp.securemail.pro',
    port: 465,
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
Nombre: ${name}
Email: ${email}
Mensaje: ${message}
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
