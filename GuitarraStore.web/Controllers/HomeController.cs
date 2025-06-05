using GuitarraStore.Data.Context;
using GuitarraStore.Modelos;
using GuitarraStore.web.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace GuitarraStore.web.Controllers
{
    public class HomeController(AppDbContext context) : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private readonly AppDbContext _context = context;

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult GuitarrasCrud()
        {
            return View();
        }

        public IActionResult Detalles(int id)
        {

            var guitarra = _context.Guitarras.FirstOrDefault(g => g.Id == id);
            
            if (guitarra == null)
            {
                return NotFound();
            }

            return View(guitarra);

        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
