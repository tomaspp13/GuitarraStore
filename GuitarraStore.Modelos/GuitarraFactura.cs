using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GuitarraStore.Modelos
{
    public class GuitarraFactura
    {
        public int FacturaId { get; set; }
        public Factura? Factura { get; set; }
        public int? GuitarraId { get; set; }
        public Guitarras? Guitarra { get; set; }
    }

}
