const express = require('express');const { MercadoPagoConfig, Preference } = require('mercadopago');const app = express();

app.use(express.json());
//Configura Mercado Pago con tu Access Token de Prueba
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-5300012898080631-101413-3ce58e5a903968f8d8ca34a09dc7c872-1577049737' });let creditoDisponible = false;
// 2. Ruta fija para el código QR de la pantalla (Genera la interfaz de pago de prueba)
app.get('/pagar', async (req, res) => {
    try {
        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                items: [{
                    title: 'Ficha Arcade Mortal Kombat',
                    quantity: 1,
                    unit_price: 10.00, // Monto simulado
                    currency_id: 'ARS'
                }],
                back_urls: {
                    success: 'https://tu-app-en-la-nube.com'
                },
                auto_return: 'approved'
            }
        });
        // Redirige al celular directamente a la pasarela de pagos de prueba
        res.redirect(response.init_point); 
    } catch (error) {
        res.status(500).send("Error al generar el pago simulado");
    }
});

app.post('/webhook', (req, res) => {
    const { action, data } = req.body;
    // Validamos que sea una notificación de pago exitoso
    if (action === "payment.created" || req.query.topic === "payment") {
        console.log("Notificación recibida de Mercado Pago: ¡Ficha abonada!");
        creditoDisponible = true; 
    }
    res.sendStatus(200); 
});
// 4. Ruta de consulta para el ESP32-C3 Mini
app.get('/status', (req, res) => {
    if (creditoDisponible) {
        creditoDisponible = false; // Consume el crédito
        res.send("ACTIVAR");
    } else {
        res.send("ESPERANDO");
    }
})

app.get('/status', (req, res) => {
    if (creditoDisponible) {
        creditoDisponible = false; // Consume el crédito
        res.send("ACTIVAR");
    } else {
        res.send("ESPERANDO");
    }
});

app.get('/exito', (req, res) => {
    res.send("<h1>¡Pago Aprobado! Mira la pantalla del Arcade para jugar.</h1>");
});

app.listen(process.env.PORT || 3000, () => console.log("Servidor Arcade Inicializado"));