import { obtenerGuitarras, eliminarGuitarras, obtenerGuitarrasPorFiltros } from "./GuitarraServicios.js";

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
export async function cargarDropdownMarcas(marcas, contenedorDropdown, contenedorPrincipal, dolar, tipofiltro, precioMin, precioMax) {
    console.log("marcas", marcas);
    console.log("tipo filtro", tipofiltro);
    
    contenedorDropdown.innerHTML = "";

    const liTodas = document.createElement("li");
    
    const aTodas = document.createElement("a");
    aTodas.className = "dropdown-item";
    aTodas.href = "#";
    aTodas.textContent = "Todas las marcas";

    aTodas.addEventListener("click", async (e) => {
        e.preventDefault();
        const guitarras = await obtenerGuitarrasPorFiltros("todas", tipofiltro, precioMin, precioMax);
        await MostrarGuitarras(guitarras, contenedorPrincipal, dolar);
        document.getElementById("inputBuscar") = ""; 
    });

    liTodas.appendChild(aTodas);
    contenedorDropdown.appendChild(liTodas);
    
    marcas.forEach(marca => {
        
        const li = document.createElement("li");
        
        const a = document.createElement("a");

        a.className = "dropdown-item";
        a.href = "#";
        a.textContent = marca.trim();

        a.addEventListener("click", async function (e) {

            e.preventDefault();  
            const guitarras_obtenidas = await obtenerGuitarrasPorFiltros(marca, tipofiltro, precioMin, precioMax);
            await MostrarGuitarras(guitarras_obtenidas, contenedorPrincipal, dolar);
            document.getElementById("inputBuscar").value = marca; 

        })

        li.appendChild(a);
        contenedorDropdown.appendChild(li);

    })


}
export async function mostrarGuitarraDetalles(guitarra,contenedor)
{ 

    var div = document.createElement("div");

    const imagen = guitarra.urlImagen || "/images/placeholder.png"; 
      

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

            
