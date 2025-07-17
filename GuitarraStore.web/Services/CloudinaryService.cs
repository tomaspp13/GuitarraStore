using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using GuitarraStore.web.Services;
using Microsoft.Extensions.Options;

namespace GuitarraStore.Web.Services
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        public CloudinaryService(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        public async Task<(string url, string publicId)> SubirImagenAsync(IFormFile archivo)
        {
            if (archivo == null || archivo.Length == 0)
                return (null, null);

            using var stream = archivo.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(archivo.FileName, stream),
                Folder = "guitarras"
            };

            var resultado = await _cloudinary.UploadAsync(uploadParams);

            return (resultado.SecureUrl.ToString(), resultado.PublicId);
        }

        public async Task EliminarImagenAsync(string publicId)
        {
            if (string.IsNullOrEmpty(publicId)) return;

            var deleteParams = new DeletionParams(publicId);
            await _cloudinary.DestroyAsync(deleteParams);
        }

    }
}

