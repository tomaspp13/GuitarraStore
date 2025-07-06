namespace GuitarraStore.web.ViewModels
{
    public class GuitarraViewModel
    {
        public int Id { get; set; }
        public string? Marca { get; set; }
        public string? Modelo { get; set; }
        public float Precio { get; set; }
        public IFormFile? ImagenArchivo { get; set; }
        public string? UrlImagen { get; set; }
    }
}
