require('dotenv').config()

const express = require('express')
const cors = require('cors')
const {GoogleGenerativeAI} = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: "gemini-3-flash-preview"})

const app = express()
app.use(cors())
app.use(express.json({limit: '10mb'}))

// endpoint para obtener ingredientes de una comida
app.post('/ingredientes', async (req, res) => {
    console.log('peticion al endpoint /ingredientes recibida')
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
    
    const { ingredientes } = req.body;
    
    const prompt = `
${ingredientes}
“Analiza los alimentos y genera retroalimentación nutricional en puntos breves.
Toma en cuenta que las comidas mostradas abarcan una semana de consumo.
Las comidas no indican patrones de consumo, representan exactamente los alimentos consumidos durante la semana.
Evalúa:
- macronutrientes
- vitaminas y minerales
- compuestos relevantes (omega 3, fibra, antioxidantes, etcétera...)
- riesgos asociados a alimentos específicos (mercurio, purinas, sodio, etc.)
- calidad general de la dieta

Usa frases tipo:
'has consumido poco…'
'has consumido mucho…'
'esto puede provocar…'”
Deja una línea vacía entre cada sección.
    `;
        
    // Llamar a Gemini (asumiendo que ya tienes configurado el modelo)
    const result = await model.generateContent(prompt);
    const respuesta = result.response.text();
    res.json({ ingredientes: respuesta })
});

app.listen(8000, () => {
    console.log('Servidor corriendo en el puerto 8000')
})