import { obtenerGuitarras, eliminarGuitarras } from "./GuitarraServicios.js";

export async function MostrarGuitarras(guitarras, contenedor, dolar) {

    if (!contenedor) {
        console.warn("Contenedor no encontrado");
        return;
    } else if (!guitarras) {
        console.warn("Guitarras no encontradas");
        return;
    }

    contenedor.innerHTML = "";

    const fila = document.createElement("div");
    fila.className = "row";

    guitarras.forEach(guitarra => {

        const col = document.createElement("div");
        col.className = "col-md-4 mb-4"; 

        const card = document.createElement("div");
        card.className = "card shadow-sm h-100";

        const imagen = guitarra.urlImagen || "/images/placeholder.png";

        const precioDolar = (guitarra.precio / dolar).toFixed(2);
        const precioCash = (guitarra.precio - guitarra.precio * 0.25).toFixed(2);

        card.innerHTML = `
            <img src="${imagen}" class="card-img-top" alt="Imagen de guitarra" style="height: 400px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${guitarra.marca} ${guitarra.modelo}</h5>
                <p class="card-text"><strong>Cash o Transferencia:</strong> $${precioCash}</p>
                <p class="card-text"><strong>Precio Lista:</strong> $${guitarra.precio}</p>
                <p class="card-text"><strong>USD:</strong> U$${precioDolar}</p>
                <p class="card-text text-success fw-bold">6 x $${(guitarra.precio / 6).toFixed(2)} sin interés</p>
            </div>
        `;
       
        card.style.cursor = "pointer";
        card.classList.add('card');

        card.addEventListener('mouseenter', () => {
            card.classList.add('card-hover');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('card-hover');
        });

        card.addEventListener("click", function () {

            window.location.href = `/Home/Detalles/${guitarra.id}`;

        })

        col.appendChild(card);

        fila.appendChild(col);
    });

    contenedor.appendChild(fila);
}

export async function mostrarGuitarraDetalles(guitarra,contenedor)
{

    console.log("Guitarra:", guitarra);

    var div = document.createElement("div");

    const imagen = guitarra.urlImagen || "/images/placeholder.png"; 
    
    console.log("Imagen:", imagen);

    div.innerHTML = `
                <h3>${guitarra.marca} - ${guitarra.modelo}</h3>
                <p>Precio: $${guitarra.precio}</p>
                <img src="${imagen}" style="width: 400px !important; height: auto !important;">
                `;

    contenedor.appendChild(div);

    return;

}
export async function MostrarGuitarrasCrud(listado) {
    try {

        const guitarras = await obtenerGuitarras();

        listado.innerHTML = "";

        guitarras.forEach(guitarra => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center flex-wrap";

            
            const info = document.createElement("div");
            info.innerHTML = `
                <h5 class="mb-1">${guitarra.marca} - ${guitarra.modelo}</h5>
                <p class="mb-1 text-muted">$${guitarra.precio}</p>
            `;

            const botones = document.createElement("div");
            botones.className = "btn-group";

            const botondetalles = document.createElement("button");
            botondetalles.className = "btn btn-outline-primary btn-sm";
            botondetalles.innerText = "Detalles";
            botondetalles.addEventListener("click", () => {
                window.location.href = `/Home/Detalles/${guitarra.id}`;
            });

            const botonedit = document.createElement("button");
            botonedit.className = "btn btn-outline-warning btn-sm";
            botonedit.innerText = "Editar";
            botonedit.addEventListener("click", () => {
                window.location.href = `/Home/Editar/${guitarra.id}`;
            });

            const botonelim = document.createElement("button");
            botonelim.className = "btn btn-outline-danger btn-sm";
            botonelim.innerText = "Eliminar";
            botonelim.addEventListener("click", async (e) => {
                e.preventDefault();
                try {
                    await eliminarGuitarras(guitarra.id);
                    await MostrarGuitarrasCrud(listado);
                } catch (error) {
                    alert("Error al eliminar la guitarra: " + error.message);
                }
            });

            botones.appendChild(botondetalles);
            botones.appendChild(botonedit);
            botones.appendChild(botonelim);

            li.appendChild(info);
            li.appendChild(botones);
            listado.appendChild(li);
        });

    } catch (error) {
        alert("Error al cargar las guitarras: " + error.message);
    }
}

            
