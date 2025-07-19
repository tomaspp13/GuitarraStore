using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuitarraStore.Data.Migrations
{
    /// <inheritdoc />
    public partial class agregarGenero : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Estilo",
                table: "Guitarras",
                newName: "Genero");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Genero",
                table: "Guitarras",
                newName: "Estilo");
        }
    }
}
