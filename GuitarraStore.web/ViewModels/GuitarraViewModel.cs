namespace GuitarraStore.web.ViewModels
{
    public class GuitarraViewModel
    {
        public int Id { get; set; }
        public string? Marca { get; set; }
        public string? Modelo { get; set; }
        public float Precio { get; set; }
        public bool Oferta {  get; set; }
        public bool MasVendida {  get; set; }
        public string? Genero {  get; set; }
        public DateTime? FechaIngreso { get; set; }
        public IFormFile? ImagenArchivo { get; set; }
        public string? IdImagen { get; set; }
    }
}
