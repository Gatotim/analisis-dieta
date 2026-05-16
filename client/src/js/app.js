// 1. Configurar el input para mostrar preview al seleccionar
document.getElementById("inputAlimento").addEventListener('change', function(evento) {
    const archivo = evento.target.files[0];
    
    if(archivo) {
        const lector = new FileReader();
        
        lector.onload = function(e) {
            // 👇 Mostrar la imagen INMEDIATAMENTE
            const preview = document.getElementById("preview");
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 300px; border-radius: 10px; margin-top: 1rem;">`;
        };
        
        lector.readAsDataURL(archivo);
    }
});

// 2. Función para enviar datos SOLO cuando dan click al botón
async function enviarDatos() {
    const archivo = document.getElementById("inputAlimento").files[0];
    
    if(!archivo) {
        console.log("no hay imagen");
        return;
    }
    
    const lector = new FileReader();
    
    lector.onload = async function() {
        try {
            const respuesta = await fetch('http://localhost:8000/analizar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ imagen: lector.result.split(',')[1]})
            });
            
            const datos = await respuesta.json();
            // añadir elementos hijo en lugar de escribir en el mismo bloque permite análisis de múltiples comidas (subiendo una foto
            // por cada comida)
            let nel = document.createElement('div');
            nel.innerHTML = marked.parse(datos.ingredientes);
            document.getElementById('resultado').appendChild(nel);
            
        } catch(error) {
            console.error("Error al enviar:", error);
        }
    };
    
    lector.readAsDataURL(archivo);
}