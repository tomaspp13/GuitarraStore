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
    }
}
