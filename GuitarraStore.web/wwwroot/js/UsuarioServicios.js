
export async function obtenerFacturasDeUsuario(usuarioId) {

    try {

        const respuesta = await fetch(`/api/UsuariosApi/ObtenerFacturas/${usuarioId}`);

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            enviarErrorAlServidor("Error al obtener las facturas. Respuesta: " + respuesta.status + " - " + errorText);
            return;
        }

        return await respuesta.json();

    }
    catch (error) {

        enviarErrorAlServidor("Error al obtener las facturas: " + error.message);
        return [];

    }
}

function enviarErrorAlServidor(mensaje) {
    fetch('/api/guitarra/LogError', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: mensaje, fecha: new Date() })
    }).catch(() => {

    });
}