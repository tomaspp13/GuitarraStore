import { obtenerGuitarras, eliminarGuitarras,agregarAlCarrito } from "./GuitarraServicios.js";

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
                <button class="btn btn-primary btn-agregar-carrito">Agregar al carrito</button>
            </div>
        `;
       
        card.style.cursor = "pointer";
        card.classList.add('card');

        const btnAgregar = card.querySelector(".btn-agregar-carrito");

        btnAgregar.addEventListener("click", function (e) {

            e.preventDefault();
            e.stopPropagation();

            agregarAlCarrito(guitarra);

        })

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
export function mostrarCarrito() {

    const contenedor = document.getElementById("carritoContainer");
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalCarrito = 0;

    carrito.forEach((guitarra, index) => {
        const total = guitarra.precio * guitarra.cantidad;
        totalCarrito += total;

        html += `
            <tr>
                <td><img src="${guitarra.urlImagen}" style="width: 206px; height: 400px; object-fit: cover;"/></td>
                <td>${guitarra.marca}</td>
                <td>${guitarra.modelo}</td>
                <td>$${guitarra.precio}</td>
                <td>${guitarra.cantidad}</td>
                <td>$${total}</td>
                <td>
                    <button class="btn btn-sm btn-success btn-sumar" data-id="${guitarra.id}">+</button>
                    <button class="btn btn-sm btn-warning btn-restar" data-id="${guitarra.id}">-</button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${guitarra.id}">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <h4>Total del carrito: $${totalCarrito}</h4>
    `;

    contenedor.innerHTML = html;

    document.querySelectorAll(".btn-sumar").forEach(btn => {
        btn.addEventListener("click", () => {
            modificarCantidad(parseInt(btn.dataset.id), 1);
        });
    });

    document.querySelectorAll(".btn-restar").forEach(btn => {
        btn.addEventListener("click", () => {
            modificarCantidad(parseInt(btn.dataset.id), -1);
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
            eliminarGuitarra(parseInt(btn.dataset.id));
        });
    });
}
function modificarCantidad(id, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const index = carrito.findIndex(g => g.id === id);
    if (index !== -1) {
        carrito[index].cantidad += cambio;

        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }
}
function eliminarGuitarra(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito = carrito.filter(g => g.id !== id);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito(); 
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

            
