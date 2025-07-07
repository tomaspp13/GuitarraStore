using GuitarraStore.Data.Context;
using GuitarraStore.Modelos;
using GuitarraStore.web.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GuitarraStore.web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuitarraController(AppDbContext context) : ControllerBase
    {

        private readonly AppDbContext _context = context;

        [HttpGet("Get")]
        public async Task<IActionResult> GetGuitarras()
        {
            var guitarras = await _context.Guitarras.ToListAsync();
            return Ok(guitarras);
        }

        [HttpGet("Get/{id}")]
        public async Task<IActionResult> GetGuitarrasById(int id)
        {
            var guitarra = await _context.Guitarras.FirstOrDefaultAsync(g => g.Id == id);

            if (guitarra == null)
            {
                return NotFound();
            }

            return Ok(guitarra);
        }

        [HttpGet("AgregarGuitarraaCarrito")]

        public async Task<IActionResult> AgregarGuitarraaCarrito(int id)
        {

            var guitarra = _context.Guitarras.AsQueryable();

            var obtenido = guitarra.FirstOrDefault(g => g.Id == id);

            if (obtenido == null)
            {
                return NotFound();
            }



            return Ok();
        }

        [HttpGet("ObtenerMarcas")]

        public async Task<IActionResult> ObtenerMarcas() 
        {
        
            var marcas = _context.Guitarras.AsQueryable();

            var resultado = await marcas.Select(m => m.Marca).Where(m => !string.IsNullOrEmpty(m)).Distinct().ToListAsync();
            
            return Ok(resultado);

        }

        [HttpGet("FiltroGuitarras")]
        public async Task<IActionResult> FiltroGuitarras(string? busqueda, string? marca,string? tipofiltro, float? precioMin, float? precioMax)
        {

            if (precioMin.HasValue && precioMax.HasValue && precioMin > precioMax)
            {
                return BadRequest("El precio mínimo no puede ser mayor al precio máximo.");
            }

            var guitarras = _context.Guitarras.AsQueryable();

            if (!string.IsNullOrWhiteSpace(busqueda))
            {
                var busquedaMinuscula = busqueda.ToLower();

                if (!busqueda.Equals("", StringComparison.OrdinalIgnoreCase))
                {
                    guitarras = guitarras.Where(g =>
                        g.Marca != null && g.Marca.ToLower().Contains(busquedaMinuscula) ||
                        g.Modelo != null && g.Modelo.ToLower().Contains(busquedaMinuscula)
                    );
                }
                
            }
            
            if (string.Equals(marca, "todas", StringComparison.OrdinalIgnoreCase))
            {
                guitarras = guitarras.OrderBy(g => g.Id);
            }
            else if (!string.IsNullOrEmpty(marca))
            {
                guitarras = guitarras.Where(g => g.Marca != null && g.Marca.Contains(marca));
            }

            if (precioMax.HasValue)
            {
                guitarras = guitarras.Where(g => g.Precio <= precioMax);
            }

            if (precioMin.HasValue)
            {
                guitarras = guitarras.Where(g => g.Precio >= precioMin);
            }

            if (string.Equals(tipofiltro, "menoramayor", StringComparison.OrdinalIgnoreCase))
            {
                guitarras = guitarras.OrderBy(g => g.Precio);
            }
            else if (string.Equals(tipofiltro, "mayoramenor", StringComparison.OrdinalIgnoreCase))
            {
                guitarras = guitarras.OrderByDescending(g => g.Precio);
            }
            else if (string.Equals(tipofiltro,"masrelevante", StringComparison.OrdinalIgnoreCase))
            {
                guitarras = guitarras.OrderBy(g => g.Id);
            }

            var result = await guitarras.ToListAsync();

            return Ok(result);
        }


        [HttpPut("Put/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] GuitarraViewModel guitarraVm)
        {
            var guitarra = await _context.Guitarras.FirstOrDefaultAsync(g => g.Id == id);

            if (guitarra == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            guitarra.Marca = guitarraVm.Marca;
            guitarra.Modelo = guitarraVm.Modelo;
            guitarra.Precio = guitarraVm.Precio;

            if (guitarraVm.ImagenArchivo != null)
            {
                string carpetaDestino = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imagenes");
                if (!Directory.Exists(carpetaDestino))
                    Directory.CreateDirectory(carpetaDestino);

                string nombreArchivo = Guid.NewGuid().ToString() + Path.GetExtension(guitarraVm.ImagenArchivo.FileName);
                string rutaCompleta = Path.Combine(carpetaDestino, nombreArchivo);

                using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                {
                    await guitarraVm.ImagenArchivo.CopyToAsync(stream);
                }

                guitarra.UrlImagen = "/imagenes/" + nombreArchivo;
            }

            _context.Guitarras.Update(guitarra);
            await _context.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("Create")]
        public async Task<IActionResult> CreateGuitarras([FromForm] GuitarraViewModel guitarraVm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string rutaImagen = null;

            if (guitarraVm.ImagenArchivo != null)
            {
                string carpetaDestino = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imagenes");
                if (!Directory.Exists(carpetaDestino))
                    Directory.CreateDirectory(carpetaDestino);

                string nombreArchivo = Guid.NewGuid().ToString() + Path.GetExtension(guitarraVm.ImagenArchivo.FileName);
                string rutaCompleta = Path.Combine(carpetaDestino, nombreArchivo);

                using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                {
                    await guitarraVm.ImagenArchivo.CopyToAsync(stream);
                }

                rutaImagen = "/imagenes/" + nombreArchivo;
            }

            var nuevaGuitarra = new Guitarras
            {
                Marca = guitarraVm.Marca,
                Modelo = guitarraVm.Modelo,
                Precio = guitarraVm.Precio,
                UrlImagen = rutaImagen
            };

            await _context.Guitarras.AddAsync(nuevaGuitarra);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("Delete/{id}")]

        public async Task<IActionResult>EliminarGuitarra(int id) 
        {

            var guitarra = await _context.Guitarras.FirstOrDefaultAsync(g => g.Id == id);

            if(guitarra == null)
            {

                return NotFound();

            }

            if (!string.IsNullOrEmpty(guitarra.UrlImagen))
            {
                string rutaImagen = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", guitarra.UrlImagen.TrimStart('/'));

                if (System.IO.File.Exists(rutaImagen))
                {
                    System.IO.File.Delete(rutaImagen);
                }
            }

            _context.Guitarras.Remove(guitarra);
           await _context.SaveChangesAsync();

            return Ok();

        }

    }
}
