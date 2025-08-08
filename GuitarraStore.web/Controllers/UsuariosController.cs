using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace GuitarraStore.web.Controllers
{
    public class UsuariosController : Controller
    {
        public IActionResult Ingresar()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> CerrarSesion()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Inicio", "Home");
        }
        public IActionResult Registrar()
        {
            return View();
        }

        public IActionResult Usuario()
        {

            return View();

        }

    }
}
