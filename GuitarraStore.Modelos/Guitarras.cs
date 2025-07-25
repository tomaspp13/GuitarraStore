﻿using Microsoft.EntityFrameworkCore.Migrations;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace GuitarraStore.Modelos
{
    public class Guitarras
    {      
        public int Id { get; set; }
        public string ?Marca { get; set; }
        public string ?Modelo { get; set; }  
        public string ? Descripcion { get; set; }
        public float Precio { get; set; }
        public string ?UrlImagen { get; set;}
        public string? IdImagen { get; set; }
        public DateTime FechaIngreso { get; set; } = DateTime.Now;
        public  bool EsMasVendida { get; set; }
        public bool EstaEnOferta { get; set; }
        public string? Genero { get; set; }

    }
}
