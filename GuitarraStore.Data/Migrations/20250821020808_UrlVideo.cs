using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuitarraStore.Data.Migrations
{
    /// <inheritdoc />
    public partial class UrlVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UrlVideo",
                table: "Guitarras",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlVideo",
                table: "Guitarras");
        }
    }
}
