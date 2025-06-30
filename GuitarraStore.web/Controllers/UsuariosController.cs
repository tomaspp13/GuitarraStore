using Microsoft.AspNetCore.Mvc;

namespace GuitarraStore.web.Controllers
{
    public class UsuariosController : Controller
    {
        public IActionResult Ingresar()
        {
            return View();
        }

        public IActionResult Registrar()
        {
            return View();
        }

    }
}
