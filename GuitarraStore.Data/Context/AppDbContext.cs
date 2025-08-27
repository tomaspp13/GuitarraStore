using Microsoft.EntityFrameworkCore;
using GuitarraStore.Modelos;

namespace GuitarraStore.Data.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Guitarras> Guitarras { get; set; }
        public DbSet<Usuarios> Usuarios { get; set; }
        public DbSet<Opiniones> Opiniones { get; set; }
        public DbSet<Factura> Factura { get; set; }

        public DbSet<GuitarraFactura> GuitarraFactura { get;set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<GuitarraFactura>()
                .HasKey(gf => new { gf.FacturaId, gf.GuitarraId });

            modelBuilder.Entity<GuitarraFactura>()
                .HasOne(gf => gf.Factura)
                .WithMany(f => f.GuitarrasFactura)
                .HasForeignKey(gf => gf.FacturaId);

            modelBuilder.Entity<GuitarraFactura>()
                .HasOne(gf => gf.Guitarra)
                .WithMany(g => g.GuitarrasFactura)
                .HasForeignKey(gf => gf.GuitarraId);

            modelBuilder.Entity<Opiniones>()
                .HasOne(o => o.Guitarra)
                .WithMany(g => g.Opiniones)
                .HasForeignKey(o => o.GuitarraId);
        }

    }
}
