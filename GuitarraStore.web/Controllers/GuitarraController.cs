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
        public IActionResult GetGuitarras()
        {
            var guitarras = _context.Guitarras.ToList();
            return Ok(guitarras);
        }

        [HttpPost("Create")]

        public async Task<IActionResult> CreateGuitarras([FromBody] Guitarras guitarra)
        {
            Console.WriteLine($"Guitarra recibida: {guitarra.Marca} - {guitarra.Modelo} - {guitarra.Precio}");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Guitarras.Add(guitarra);
            await _context.SaveChangesAsync();

            return Ok();

        }

    }
}
