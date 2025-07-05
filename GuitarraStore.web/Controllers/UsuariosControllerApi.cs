using GuitarraStore.Data.Context;
using GuitarraStore.Modelos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Security.Policy;

namespace GuitarraStore.web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Verificar_correo(string correo)
        {
            bool existe = await _context.Usuarios.AnyAsync(u => u.Email.Equals(correo, StringComparison.CurrentCultureIgnoreCase));
            return Ok(!existe);
        }

        [HttpPost("DevolverUsuario")]
        public async Task<IActionResult> Devolver_usuario([FromBody] Usuarios usuario_enviado)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == usuario_enviado.Email);

            if (usuario == null)
            {
                return NotFound("Usuario no encontrado");
            }

            if (!BCrypt.Net.BCrypt.Verify(usuario_enviado.Password, usuario.Password))
            {

                return NotFound("Contraseña incorrecta");
            }
            Console.WriteLine("\n\nUSUARIO ES : " + usuario.Email);
            return Ok(usuario);
        }

        [HttpPost("RegistrarUsuario")]
        public async Task<IActionResult> Registrar_usuario([FromBody] Usuarios usuario_enviado)
        {
            if (usuario_enviado == null)
            {
                return BadRequest("El usuario no existe");
            }

            string hash = BCrypt.Net.BCrypt.HashPassword(usuario_enviado.Password);
            var usuario = new Usuarios
            {
                Email = usuario_enviado.Email,
                Password = hash,
                TipoUsuario = "Cliente"
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }

}
