const express = require('express');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const app = express();

app.use(express.json());

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-5300012898080631-101413-3ce58e5a903968f8d8ca34a09dc7c872-1577049737' }); // ACA PEGA TU TEST- DEL VENDEDOR

let creditoDisponible = false;

app.get('/pagar', async (req, res) => {
    try {
        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                items: [{ title: 'Ficha Arcade', quantity: 1, unit_price: 10, currency_id: 'ARS' }],
            }
        });
        res.redirect(response.sandbox_init_point);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error");
    }
});

app.post('/webhook', (req, res) => {
    console.log("Pago recibido!");
    creditoDisponible = true;
    res.sendStatus(200);
});

app.get('/status', (req, res) => {
    if (creditoDisponible) {
        creditoDisponible = false;
        res.send("ACTIVAR");
    } else {
        res.send("ESPERANDO");
    }
});

app.get('/', (req, res) => {
    res.send("Servidor Arcade OK");
});

app.listen(process.env.PORT || 3000, () => console.log("Servidor Arcade Inicializado"));