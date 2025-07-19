using GuitarraStore.Data.Context;
using GuitarraStore.Modelos;
using GuitarraStore.web.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace GuitarraStore.web.Controllers
{
    public class HomeController() : Controller
    {

        public IActionResult Guitarras()
        {
            return View();
        }

        public IActionResult Inicio()
        {
            return View();
        }

        public IActionResult Crear()
        {
            return View();
        }

        public IActionResult GuitarrasCrud()
        {
            return View();
        }

        public IActionResult Detalles(int id)
        {
            return View();
        }

        public IActionResult Editar(int id)
        {
            return View();
        }
        public IActionResult carrito()
        {
            return View();
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
