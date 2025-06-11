import { obtenerGuitarras,eliminarGuitarras,editarGuitarras } from "./GuitarraServicios.js";
export function MostrarGuitarras(guitarras, contenedor) {

    if (!contenedor) {
        console.warn("Contenedor no encontrado");
        return;
    } else if (!guitarras) {
        console.warn("Guitarras no encontrada");
        return;
    }

    console.log("Ejecutando UI");

    contenedor.innerHTML = "";

    guitarras.forEach(guitarra => {

        var div = document.createElement("div");

        const imagen = guitarra.urlImagen || "/images/placeholder.png";

        div.innerHTML = `
                <h3>${guitarra.marca} - ${guitarra.modelo}</h3>
                <p>Precio: $${guitarra.precio}</p>
                <img src="${imagen}" alt="Imagen de guitarra" width="200" height="150">
                `;

        contenedor.appendChild(div);

    })

}
export function mostrarGuitarraDetalles(guitarra,contenedor)
{

    var div = document.createElement("div");

    const imagen = guitarra.urlImagen || "/images/placeholder.png"; 

    div.innerHTML = `
                <h3>${guitarra.marca} - ${guitarra.modelo}</h3>
                <p>Precio: $${guitarra.precio}</p>
                <img src="${imagen}" alt="Imagen de guitarra" width="200" height="150">
                `;

    contenedor.appendChild(div);

    return;

}
export async function MostrarGuitarrasCrud(listado)
{

    try
    {

        const guitarras = await obtenerGuitarras();

        listado.innerHTML = "";

        guitarras.forEach(guitarra => {

            const li = document.createElement("li");
            li.innerHTML = `<strong>${guitarra.marca}</strong> - ${guitarra.modelo} - ${guitarra.precio} €`;

            const botonelim = document.createElement("button");
            botonelim.innerText = "Eliminar";

            const botonedit = document.createElement("button");
            botonedit.innerText = "Editar";

            const botondetalles = document.createElement("button");
            botondetalles.innerText = "Detalles";

            botondetalles.addEventListener("click", function () {

                window.location.href = `/Home/Detalles/${guitarra.id}`;

            })
            botonedit.addEventListener("click", function () {

                window.location.href = `/Home/Editar/${guitarra.id}`;

            })
            botonelim.addEventListener("click", async function (e) {

                e.preventDefault();

                try {

                    await eliminarGuitarras(guitarra.id);

                   await MostrarGuitarrasCrud(listado);

                    
                }
                catch (error) {
                    alert("Error al eliminar la guitarra: " + error.message)
                }

            })

            li.appendChild(botondetalles);
            li.appendChild(botonedit);
            li.appendChild(botonelim);

            listado.appendChild(li);

        });

    }
    catch (error)
    {

        alert("Error al cargar las guitarras: " + error.message);

    } 
    
}
            
