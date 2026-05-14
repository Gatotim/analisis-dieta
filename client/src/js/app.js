function enviarDatos() {
    const archivo = document.getElementById("inputAlimento").files[0]
    if(!archivo) {
        console.log("no hay imagen")
    } else {
        const lector = new FileReader()
            lector.onload = async function(){
                const respuesta = await fetch('http://localhost:8000/analizar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({ imagen: lector.result.split(',')[1]})
                })
                const datos = await respuesta.json()
                document.getElementById('resultado').innerHTML = datos.ingredientes

                const preview = document.getElementById("preview")
                preview.innerHTML = `<img src="${lector.result}" style="max-width: 300px; border-radius: 10px; margin-top: 1rem;">`
                console.log(lector.result)
            }
        lector.readAsDataURL(archivo)
    }
}