const obtenerAnalisis = async () => {
    // Obtener los textos de todos los divs y crear un string con los ingredientes
    let ingredientes = "";
    document.getElementById("resultado").querySelectorAll("div").forEach((div, index) => {
        ingredientes += `Comida ${index+1}: ${div.textContent}`;
    });
    console.log(`Ingredientes: ${ingredientes}`);
    
    // Enviar al endpoint
    try {
        const respuesta = await fetch('http://localhost:8000/analisis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ingredientes: ingredientes,
            })
        });
        
        const datos = await respuesta.json();
        console.log("Recomendaciones:", datos.ingredientes);
        document.getElementById('resultado2').innerHTML = marked.parse(datos.ingredientes);
        
        
    } catch(error) {
        console.error("Error al enviar:", error);
    }
};

