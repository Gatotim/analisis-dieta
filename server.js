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
})
app.listen(8000, () => {
    console.log('Servidor corriendo en el puerto 3000')
})