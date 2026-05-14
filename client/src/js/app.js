function enviarDatos() {
    const archivo = document.getElementById("inputAlimento").files[0]
    const resultado = document.getElementById('resultado')
    if(!archivo) {
        console.log("no hay imagen")
    } else {
        resultado.innerHTML = 'Analizando imagen ...'
        const lector = new FileReader()
            lector.onload = async function(){
                const preview = document.getElementById("preview")
                preview.innerHTML = `<img src="${lector.result}" style="max-width: 300px; border-radius: 10px; margin-top: 1rem;">`
                console.log(lector.result)
                const respuesta = await fetch('http://localhost:8000/analizar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({ imagen: lector.result.split(',')[1]})
                })
                const datos = await respuesta.json()
                resultado.innerHTML = datos.ingredientes
                resultado.style.animation = 'none'
                setTimeout(() => {
                    resultado.style.animation='fadeIn 0.8s ease-in'
                }, 10)
            }
        lector.readAsDataURL(archivo)
    }
}