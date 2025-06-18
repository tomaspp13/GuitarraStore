using GuitarraStore.Data.Context;
using GuitarraStore.Modelos;
using Microsoft.AspNetCore.Http;
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

        public IActionResult GetGuitarrasById(int id)
        {

            var guitarra = _context.Guitarras.FirstOrDefault(g => g.Id == id);

            if (guitarra == null)
            {
                return NotFound();
            }

            return Ok(guitarra);

        }

        [HttpGet("FiltroGuitarras/{tipofiltro}")]
        public IActionResult FiltroGuitarras(string tipofiltro)
        {
            Console.WriteLine(tipofiltro);

            if (string.IsNullOrEmpty(tipofiltro))
            {
                return BadRequest("Los parámetros no pueden ser nulos.");
            }

            var guitarras = _context.Guitarras.ToList(); 

            if (tipofiltro.Equals("menoramayor", StringComparison.OrdinalIgnoreCase))
            {
               guitarras = guitarras.OrderBy(g => g.Precio).ToList();
            }
            else if (tipofiltro.Equals("mayoramenor", StringComparison.OrdinalIgnoreCase))
            {
                guitarras = guitarras.OrderByDescending(g => g.Precio).ToList();
            }

            return Ok(guitarras);
        }

        [HttpPut("Put/{id}")]

        public IActionResult Update(int id, [FromBody] Guitarras guitarraEditada)
        {
            var guitarra = _context.Guitarras.FirstOrDefault(g => g.Id == id);

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

            Console.WriteLine("Entre al create guitarras");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Guitarras.Add(guitarra);
            
            await _context.SaveChangesAsync();
            

            return Ok();

        }

        [HttpDelete("Delete/{id}")]

        public IActionResult EliminarGuitarra(int id) 
        {

            var guitarra = _context.Guitarras.FirstOrDefault(g => g.Id == id);

            if(guitarra == null)
            {

                return NotFound();

            }

            _context.Guitarras.Remove(guitarra);
            _context.SaveChanges();

            return Ok();

        }

    }
}
