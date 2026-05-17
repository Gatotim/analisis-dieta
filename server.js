require('dotenv').config()

const {GoogleGenerativeAI} = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: "gemini-3-flash-preview"})
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json({limit: '10mb'}))

app.post('/analizar', async (req, res) => {
    console.log('peticion recibida')
    const { imagen } = req.body

    try {
        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: imagen
                }
            },
            '¿Que ingredientes tiene este alimento? Lista solo los ingredientes en el siguiente formato: [A, B, C, ...]. No escribas otras palabras fuera de ese formato. No incluyas ingredientes ambigüos como "hierbas" o "especies", dicho ingredientes déjalos fuera.'
        ])
        const respuesta = result.response.text()
        res.json({ ingredientes: respuesta })
    } catch (error) {
        console.error('Error Gemini: ', error.message)
        if(error.message.includes('429')) {
            res.status(429).json({error: 'limite de cuota alcanzado, intenta mas tarde'})
        } else {
            res.status(500).json({error: 'Error al procesar la imagen'})
        }
    }
    })
    // Endpoint para recomendaciones
app.post('/recomendaciones', async (req, res) => {
    console.log('Petición de recomendaciones recibida');
    
    const { ingredientes, prompt } = req.body;
    
    try {

        // Crear el prompt para Gemini
        const promptCompleto = `
        ${prompt}
        ${ingredientes}
        `;
        
        // Llamar a Gemini (asumiendo que ya tienes configurado el modelo)
        const result = await model.generateContent(promptCompleto);
        const respuesta = result.response.text();
        res.json({ ingredientes: respuesta })
    } catch(error) {
        console.error('Error Gemini: ', error.message)
        if(error.message.includes('429')) {
            res.status(429).json({error: 'limite de cuota alcanzado, intenta mas tarde'})
        } else {
            res.status(500).json({error: 'Error al procesar la imagen'})
        }
    }
});
app.listen(8000, () => {
    console.log('Servidor corriendo en el puerto 3000')
})