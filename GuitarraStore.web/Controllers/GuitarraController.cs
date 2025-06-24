using GuitarraStore.Data.Context;
using GuitarraStore.Modelos;
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

        [HttpGet("FiltroGuitarras")]
        public async Task<IActionResult> FiltroGuitarras(string? busqueda, string? tipofiltro, float? precioMin, float? precioMax)
        {
            var guitarras = _context.Guitarras.AsQueryable();

            if (!string.IsNullOrEmpty(busqueda))
            {
                var palabras = busqueda.ToLower().Split(" ");

                guitarras = guitarras.Where(g =>
                    palabras.Any(p =>
                        g.Marca.ToLower().Contains(p) ||
                        g.Modelo.ToLower().Contains(p)
                    )
                );
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

            var result = await guitarras.ToListAsync();
            return Ok(result);
        }

        [HttpPut("Put/{id}")]

        public async Task<IActionResult>Update(int id, [FromBody] Guitarras guitarraEditada)
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

            guitarra.Marca = guitarraEditada.Marca;
            guitarra.Modelo = guitarraEditada.Modelo;
            guitarra.Precio = guitarraEditada.Precio;
            guitarra.UrlImagen = guitarraEditada.UrlImagen;

            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateGuitarras([FromBody] Guitarras guitarra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _context.Guitarras.AddAsync(guitarra);

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

           _context.Guitarras.Remove(guitarra);
           await _context.SaveChangesAsync();

            return Ok();

        }

    }
}
