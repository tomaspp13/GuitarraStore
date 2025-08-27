using GuitarraStore.Data.Context;
using GuitarraStore.Data.Migrations;
using GuitarraStore.Modelos;
using GuitarraStore.web.DTO;
using GuitarraStore.web.ViewModels;
using GuitarraStore.Web.Services;
using GuitarraStore.web.Loggers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text.Json;
using Microsoft.CodeAnalysis.Options;

namespace GuitarraStore.web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuitarraController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly CloudinaryService _cloudinaryService;
        private readonly ILogger<GuitarraController> _logger;
        private static double? _valorDolarCache = null;
        private static DateTime _cacheTime = DateTime.MinValue;

        public GuitarraController(AppDbContext context, CloudinaryService cloudinaryService, ILogger<GuitarraController> logger)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
            _logger = logger;
        }
        [HttpPost("LogError")]
        public IActionResult LogError([FromBody] LogRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Error))
            {
                _logger.LogWarning("El mensaje de error es requerido.");
            }

            _logger.LogError("Error capturado en el frontend: {Error} - Fecha: {Fecha}",
                request.Error, request.Fecha);

            return Ok();
        }

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

        [HttpGet("ObtenerGuitarrasFactura/{facturaId}/{idUsuario}")]
        public async Task<IActionResult> ObtenerGuitarrasFactura(int facturaId, string idUsuario)
        {

            var guitarras = await _context.GuitarraFactura.Where(f => f.FacturaId == facturaId && f.Factura.UsuarioId == int.Parse(idUsuario)).Select(g => g.Guitarra).ToListAsync();

            if (guitarras == null)
            {
                return NotFound();
            }

            return Ok(guitarras);
        }

        [HttpGet("GuitarrasCategorias")]
        public async Task<IActionResult> MostrarCategoriasGuitarras()
        {
            var guitarras = await _context.Guitarras
                .Where(g => g.EsMasVendida || g.EstaEnOferta || g.Genero == "metal"
                            || g.Genero == "rock" || g.Genero == "pop" || g.Genero == "jazz")
                .OrderByDescending(g => g.FechaIngreso)
                .ToListAsync();

            var listado = new
            {
                Metal = guitarras.Where(g => g.Genero == "metal").Take(4).ToList(),
                Rock = guitarras.Where(g => g.Genero == "rock").Take(4).ToList(),
                Pop = guitarras.Where(g => g.Genero == "pop").Take(4).ToList(),
                Jazz = guitarras.Where(g => g.Genero == "jazz").Take(4).ToList(),
                EnOfertas = guitarras.Where(g => g.EstaEnOferta).Take(4).ToList(),
                Nuevas = guitarras.OrderByDescending(g => g.FechaIngreso).Take(4).ToList(),
                MasVendidas = guitarras.Where(g => g.EsMasVendida).Take(4).ToList()
            };

            return Ok(listado);
        }

        [HttpGet("AgregarGuitarraaCarrito")]
        public IActionResult AgregarGuitarraaCarrito(int id)
        {

            var guitarra = _context.Guitarras.AsQueryable();

            var obtenido = guitarra.FirstOrDefault(g => g.Id == id);

            if (obtenido == null)
            {
                _logger.LogWarning("Intento de agregar guitarra no encontrada al carrito. ID: {Id}", id);
                return NotFound(new { mensaje = "La guitarra no fue encontrada." });
            }

            _logger.LogInformation("Guitarra con ID {Id} agregada al carrito correctamente.", id);
            return Ok(new { mensaje = "Guitarra agregada al carrito correctamente." });

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

        [HttpPost("Compra")]
        public async Task<IActionResult> CompraGuitarras([FromBody] ComprasDTO compra)
        {
            if (compra == null || compra.GuitarrasCompradas == null || !compra.GuitarrasCompradas.Any())
                return BadRequest("Datos de compra inválidos.");

            using var transaccion = await _context.Database.BeginTransactionAsync();

            try
            {

                var factura = new Factura
                {

                    UsuarioId = compra.IdUsuario,
                    Fecha = DateTime.Now

                };

                _context.Factura.Add(factura);
               await _context.SaveChangesAsync();

                foreach(var guitarra in compra.GuitarrasCompradas)
                {

                    var guitarraBd = await _context.Guitarras.FirstAsync(g => g.Id == guitarra.IdGuitarra);

                    if (guitarraBd != null) { guitarraBd.Stock -= guitarra.StokGuitarra;

                        _context.Guitarras.Update(guitarraBd);

                        var guitarraFactura = new GuitarraFactura
                        {
                            FacturaId = factura.Id,
                            GuitarraId = guitarra.IdGuitarra

                        };

                        _context.GuitarraFactura.Add(guitarraFactura);
                        
                    }
   
                }

                await _context.SaveChangesAsync();
                await transaccion.CommitAsync();
                return Ok();

            }
            catch (Exception ex) {

                await transaccion.RollbackAsync();

                _logger.LogError(ex, "Error al realizar la compra del usuario con ID {Id}", compra.IdUsuario);

                return StatusCode(500, new { mensaje = "Ocurrió un error al realizar la compra. Intente más tarde." });

            }

        }

        [HttpPut("Put")]
        public async Task<IActionResult> Update([FromForm] GuitarraViewModel guitarraVm)
        {

            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Datos inválidos al intentar actualizar guitarra con ID {Id}.", guitarraVm.Id);
                    return BadRequest(new { mensaje = "Datos inválidos enviados." });
                }

                var guitarra = await _context.Guitarras.FirstOrDefaultAsync(g => g.Id == guitarraVm.Id);

                if (guitarra == null)
                {
                    _logger.LogWarning("Guitarra con ID {Id} no encontrada para actualización.", guitarraVm.Id);
                    return NotFound(new { mensaje = "La guitarra no fue encontrada." });
                }

                guitarra.Marca = guitarraVm.Marca;
                guitarra.Modelo = guitarraVm.Modelo;
                guitarra.Descripcion = guitarraVm.Descripcion;
                guitarra.Stock = guitarraVm.Stock;
                guitarra.Precio = guitarraVm.Precio;
                guitarra.EsMasVendida = guitarraVm.MasVendida;
                guitarra.EstaEnOferta = guitarraVm.Oferta;
                guitarra.Genero = guitarraVm.Genero;
                guitarra.FechaIngreso = (DateTime)guitarraVm.FechaIngreso;
                guitarra.UrlVideo = guitarraVm.UrlVideo;

                if (guitarraVm.ImagenArchivo != null && guitarraVm.ImagenArchivo.Length > 0)
                {
                    await _cloudinaryService.EliminarImagenAsync(guitarra.IdImagen);
                    var (url, id) = await _cloudinaryService.SubirImagenAsync(guitarraVm.ImagenArchivo);

                    guitarra.UrlImagen = url;
                    guitarra.IdImagen = id;
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("Guitarra con ID {Id} actualizada correctamente.", guitarraVm.Id);
                return Ok(new { mensaje = "¡La guitarra se actualizó correctamente!" });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar guitarra con ID {Id}.", guitarraVm.Id);
                return StatusCode(500, new { mensaje = "Ocurrió un error al actualizar la guitarra. Intente más tarde." });
            }
        }


        [HttpPost("Create")]
        public async Task<IActionResult> CreateGuitarras([FromForm] GuitarraViewModel guitarraVm)
        {

            try
            {

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Datos inválidos al intentar crear guitarra.");
                    return BadRequest(new { mensaje = "Datos inválidos enviados." });
                    
                }

                string? rutaImagen = null;
                string? idimagen = null;

                if (guitarraVm.ImagenArchivo != null)
                {
                    var resultadoSubida = await _cloudinaryService.SubirImagenAsync(guitarraVm.ImagenArchivo);
                    rutaImagen = resultadoSubida.url;
                    idimagen = resultadoSubida.publicId;
                }

                var nuevaGuitarra = new Guitarras
                {
                    Marca = guitarraVm.Marca,
                    Modelo = guitarraVm.Modelo,
                    Descripcion = guitarraVm.Descripcion,
                    Stock = guitarraVm.Stock,
                    Precio = guitarraVm.Precio,
                    UrlImagen = rutaImagen,
                    IdImagen = idimagen,
                    EsMasVendida = guitarraVm.MasVendida,
                    EstaEnOferta = guitarraVm.Oferta,
                    Genero = guitarraVm.Genero,
                    UrlVideo = guitarraVm.UrlVideo
                };

                await _context.Guitarras.AddAsync(nuevaGuitarra);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Error al intentar crear guitarra."); 
                return BadRequest(new { error = ex.Message });
            }

        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> EliminarGuitarra(int id) 
        {

            var guitarra = await _context.Guitarras.FirstOrDefaultAsync(g => g.Id == id);

            if(guitarra == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(guitarra.IdImagen))
            {
               await _cloudinaryService.EliminarImagenAsync(guitarra.IdImagen);
            }

           _context.Guitarras.Remove(guitarra);
           await _context.SaveChangesAsync();

           return Ok();

        }

        [HttpGet("ValorDolar")]
        public async Task<IActionResult> Dolar()
        {
           
           if (_valorDolarCache.HasValue && (DateTime.Now - _cacheTime).TotalMinutes < 10)
           { 
                    return Ok(_valorDolarCache.Value);
           }

           using var httpClient = new HttpClient();
           var response = await httpClient.GetStringAsync("https://dolarapi.com/v1/dolares/oficial");
           var json = JsonDocument.Parse(response);
           var valor = json.RootElement.GetProperty("venta").GetDouble();

           _valorDolarCache = valor;
           _cacheTime = DateTime.Now;

           return Ok(valor);
          
        }

        [HttpPost("CrearComentario")]
        public async Task<IActionResult> AgregarOpinion([FromBody] OpinionDTO opinionDto)
        {
            try
            {

                if (opinionDto == null)
                {
                    _logger.LogWarning("Datos inválidos al intentar Agregar Opinion.");
                    return BadRequest(new { mensaje = "Datos inválidos enviados." });
                }


                var opinion = new Opiniones
                {
                    Comentario = opinionDto.Comentario,
                    Calificacion = opinionDto.Calificacion,
                    Fecha = DateTime.Now,
                    UsuarioId = opinionDto.UsuarioId,
                    GuitarraId = opinionDto.IdGuitarra,
                    Guitarra = null!,
                    Usuario = null!,
                    NombreUsuario = opinionDto.NombreUsuario
                };

                _context.Opiniones.Add(opinion);
                await _context.SaveChangesAsync();

                return NoContent();

            }
            catch (Exception ex)
            {
                _logger.LogWarning("Error al intentar Agregar Opinion.");
                return BadRequest(ex);
                
            }
 
        }

        [HttpGet("ObtenerComentarios/{idGuitarra}")]
        public async Task<IActionResult> ObtenerComentarios(int idGuitarra)
        {
            var opiniones = await _context.Opiniones.Where(o => o.GuitarraId == idGuitarra)
            .OrderByDescending(o => o.Fecha).Take(5).ToListAsync();

            return Ok(opiniones);
        }

    }
}
