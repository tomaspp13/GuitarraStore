using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GuitarraStore.Modelos
{
    public class Usuarios
    {
        public int Id { get; set; }
        public string? Nombre {  get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? TipoUsuario { get; set; }
        public List<Factura> Facturas { get; set; } = new();
        public List<Opiniones> Opiniones { get; set; } = new();
    }
}
