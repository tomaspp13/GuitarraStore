
export async function obtenerGuitarras() {
    
    try {

        const respuesta = await fetch("/api/guitarra/Get");

        if (!respuesta.ok) {

            const errorText = await respuesta.text();
            throw new Error("Error al obtener las guitarras. Respuesta: " + respuesta.status + " - " + errorText);

        }

        return await respuesta.json();

    } catch (error) {
        alert("Error al obtener las guitarras: " + error.message);
    }  

}

export async function obtenerMarcas() {
    
    try {

        const respuesta = await fetch(`/api/guitarra/ObtenerMarcas`);

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            throw new Error("Error al obtener las guitarras. Respuesta: " + respuesta.status + " - " + errorText);
        }

        const marcas = await respuesta.json();
        
        return marcas;
    } catch (error) {
        alert("Error al obtener las guitarras: " + error.message);
        return [];
    }
}

export async function obtenerGuitarrasPorMarca(busqueda,marca, tipoFiltro, precioMin, precioMax) {
    
    const params = new URLSearchParams();
    
    if (busqueda) params.append("busqueda", busqueda);
    if (marca) params.append("marca", marca);
    if (tipoFiltro) params.append("tipofiltro", tipoFiltro);
    if (precioMin != null && precioMin !== "") params.append("precioMin", precioMin);
    if (precioMax != null && precioMax !== "") params.append("precioMax", precioMax);
    
    try {

        const guitarrasFiltradas = await fetch(`/api/guitarra/FiltroGuitarras?${params.toString()}`);

        if (!guitarrasFiltradas.ok) {

            const errorText = await guitarrasFiltradas.text();
            throw new Error("Error al obtener las guitarras. Respuesta: " + guitarrasFiltradas.status + " - " + errorText);

        }

        const guitarras = await guitarrasFiltradas.json();

        return guitarras;     

    } catch (error) {
        console.error("Error al obtener guitarras por filtros:", error);
        return [];
    }
}
export async function cargarMarcas(contenedorMarcas) {

    const respuesta = await fetch('/api/guitarra/ObtenerMarcas');

    if (!respuesta.ok) {

        const errorText = await respuesta.text();

        throw new Error("Error al obtener las guitarras. Respuesta: " + respuesta.status + " - " + errorText);
    }

    const marcas = await respuesta.json();

    marcas.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        contenedorMarcas.appendChild(option);
    });
}
export async function obtenerGuitarrasPorId(id)
{
    try
    {
        const respuesta = await fetch(`/api/guitarra/Get/${id}`);

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            throw new Error("Error al obtener la guitarra por ID. Respuesta: " + respuesta.status + " - " + errorText);
        }

        return await respuesta.json();

    } catch (error)
    {
        alert("Error al obtener guitarra por ID: " + error.message);
    }

}

export async function crearGuitarras(formData) {

    try {
        const response = await fetch("/api/Guitarra/Create", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error en la respuesta de la API: " + response.status);
        }

        return;

    } catch (error) {
        alert("Error al crear la guitarra: " + error.message);
    }
}

export async function editarGuitarras(formData)
{
    try
    {
        const respuesta = await fetch(`/api/guitarra/Put`, {
            method: "PUT",
            body: formData 
        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            throw new Error("Error al editar la guitarra. Respuesta: " + respuesta.status + " - " + errorText);
            return;
        }

        alert("Guitarra actualizada correctamente.");
        window.location.href = "/Home/GuitarrasCrud";

    } catch (error) {

        alert("Error al editar: " + error.message);
    }
    
}
export function agregarAlCarrito(guitarra) {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const index = carrito.findIndex(g => g.id === guitarra.id);

    if (index === -1) {
        
        carrito.push({ ...guitarra, cantidad: 1 });
        alert("Guitarra agregada al carrito.");
    } else {
        
        carrito[index].cantidad += 1;
        alert("Cantidad aumentada en el carrito.");
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

}
export async function obtenerValorDolar() {

    try {

        const valor = await fetch("https://dolarapi.com/v1/dolares/oficial");
        if (!valor.ok) {
            throw new Error("Error al obtener el valor del Dolar. Respuesta: " + valor.status);
        }

        const dolar = await valor.json();

        return parseFloat(dolar.venta);

    }
    catch (error) {

        alert("Error al obtener valor del Dolar: " + error.message);
    }
}

export async function eliminarGuitarras(guitarra)
{
    console.log(guitarra)

    try {

        const respuesta = await fetch(`/api/guitarra/Delete/${guitarra.id}`, {
            method: "DELETE"
            
        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            throw new Error("Error al eliminar la guitarra. Respuesta: " + respuesta.status + " - " + errorText);
        }

        alert("Guitarra eliminada correctamente.");
        return;
    }
    catch (error) {
        alert("Error al eliminar la guitarra: " + error.message);
    }    

}
