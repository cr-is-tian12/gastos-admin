/*
    Esta funcion convierte un valor en la moneda que queremos,
     en este caso la moneda Chilena
*/
export const pesoChileno = (cantidad) =>{

    return Number(cantidad).toLocaleString('es-CL',{
        style: 'currency', // Moneda
        currency: 'CLP' //Moneda Chilena
    })
}

export const generarID = () =>{
    const fecha = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2)
    return random + fecha
}

export const formatearFecha = fecha => {
    const fechaNueva = new Date(fecha)
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    }

    return fechaNueva.toLocaleDateString('es-CL', opciones)
}