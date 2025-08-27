namespace GuitarraStore.web.DTO
{
    public class OpinionDTO
    {
        public int IdGuitarra { get; set; }
        public string Comentario { get; set; } = string.Empty;
        public string? NombreUsuario { get; set; }
        public int Calificacion { get; set; }
        public int UsuarioId { get; set; }
    }
}
