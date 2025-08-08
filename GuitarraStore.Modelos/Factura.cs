using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GuitarraStore.Modelos
{
    public class Factura
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public int UsuarioId { get; set; }
        public Usuarios? Usuario { get; set; }
        public List<GuitarraFactura> ?GuitarrasFactura { get; set; } = new();
    }


}
