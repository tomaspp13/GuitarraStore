using GuitarraStore.Data.Context;
using GuitarraStore.web.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace GuitarraStore.web.Controllers
{
    [Route("api/[controller]")]

    [ApiController]

    public class HomeController(AppDbContext context) : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private readonly AppDbContext _context = context;

        [HttpGet("Get")]
        public IActionResult GetGuitarras()
        {
            var guitarras = _context.Guitarras.ToList();
            return Ok(guitarras);
        }

        /*public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }*/
    }
}
