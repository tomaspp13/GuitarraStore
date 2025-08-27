using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuitarraStore.Data.Migrations
{
    /// <inheritdoc />
    public partial class agregarNombreUsuarioOpiniones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NombreUsuario",
                table: "Opiniones",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NombreUsuario",
                table: "Opiniones");
        }
    }
}
