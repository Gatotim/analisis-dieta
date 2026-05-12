function enviarDatos() {
    const archivo = document.getElementById("inputAlimento").files[0]
    if(!archivo) {
        console.log("no hay imagen")
    } else {
        const lector = new FileReader()
            lector.onload = function(){
                console.log(lector.result)
            }
        lector.readAsDataURL(archivo)
    }
}

