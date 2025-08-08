using GuitarraStore.Data.Context;
using GuitarraStore.Modelos;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Security.Claims;
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
            if (string.IsNullOrEmpty(correo))
            {
                return BadRequest("El correo no puede ser nulo o vacío.");
            }

            bool existe = await _context.Usuarios.AnyAsync(u => u.Email != null && u.Email.Equals(correo, StringComparison.CurrentCultureIgnoreCase));
            return Ok(!existe);
        }

        [HttpPost("DevolverUsuario")]
        public async Task<IActionResult> Devolver_usuario([FromBody] Usuarios usuario_enviado)
        {

            try
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

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                    new Claim(ClaimTypes.Name,usuario.Nombre),
                    new Claim(ClaimTypes.Role, usuario.TipoUsuario),
                    new Claim(ClaimTypes.Email,usuario.Email)
                    
                };

                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

                if (string.IsNullOrEmpty(usuario.TipoUsuario))
                {
                    return StatusCode(500, "El usuario no tiene un rol asignado.");
                }

                var rol = User.FindFirst(ClaimTypes.Role)?.Value;    

                return Ok(usuario.TipoUsuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error interno: " + ex.Message);
            }
        }

        [HttpPost("RegistrarUsuario")]
        public async Task<IActionResult> Registrar_usuario([FromBody] Usuarios usuario_enviado)
        {
            if (usuario_enviado == null)
            {
                return BadRequest("El usuario no existe");
            }

            string hash = BCrypt.Net.BCrypt.HashPassword(usuario_enviado.Password);

            var usuarioExiste = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == usuario_enviado.Email);

            if (usuarioExiste != null)
            {
                return Conflict("El correo electrónico ya está registrado.");
            }

            var usuario = new Usuarios
            {   
                Nombre = usuario_enviado.Nombre,
                Email = usuario_enviado.Email,
                Password = hash,
                TipoUsuario = "Cliente"
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("ObtenerFacturas/{id}")]

        public async Task<IActionResult> ObtenerFacturas(string id)
        {

            var facturas = await _context.Factura.Where(f=> f.UsuarioId == int.Parse(id)).ToListAsync();

            if (facturas == null)
            {
                return BadRequest("Usuario no encontrado");
            }

            return Ok(facturas);

        }
        
    }

}
