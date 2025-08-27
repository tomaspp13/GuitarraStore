using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GuitarraStore.Modelos
{
    public class Opiniones
    {
        public int Id { get; set; }
        public string? Comentario { get; set; }
        public int Calificacion { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;
        public int GuitarraId { get; set; }
        public Guitarras Guitarra { get; set; } = null!;
        public int UsuarioId { get; set; }
        public Usuarios Usuario { get; set; } = null!;
        public string? NombreUsuario { get; set; }
    }
}
