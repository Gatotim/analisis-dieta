// Función asíncrona para obtener los textos y enviarlos
const enviarRecomendaciones = async () => {
    // Obtener todos los textos de los divs
    //const contenedor = document.getElementById("resultado");
    //const divs = contenedor.querySelectorAll("div");
    
    // Crear un string con todos los ingredientes
    let ingredientesString = "";
    document.getElementById("resultado").querySelectorAll("div").forEach((div, index) => {
        console.log(`Comida ${index+1}: ${div.textContent}`);
        ingredientesString += `Comida ${index+1}: ${div.textContent}`;
    });
    
    
    // Enviar al endpoint
    try {
        const respuesta = await fetch('http://localhost:8000/recomendaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ingredientes: ingredientesString,
                prompt: `
“Analiza los alimentos y genera retroalimentación nutricional en puntos breves. Toma en cuenta que las comidas mostradas abarcan una semana de consumo. Evalúa:

macronutrientes
vitaminas y minerales
compuestos relevantes (omega 3, fibra, antioxidantes, etc.)
riesgos asociados a alimentos específicos (mercurio, purinas, sodio, etc.)
calidad general de la dieta

Usa frases tipo:

‘has consumido poco…’
‘has consumido mucho…’
‘esto puede provocar…’”.
                `
            })
        });
        
        const datos = await respuesta.json();
        console.log("Recomendaciones:", datos.ingredientes);
        document.getElementById('resultado2').innerHTML = marked.parse(datos.ingredientes)
        
        
    } catch(error) {
        console.error("Error al enviar:", error);
    }
};

