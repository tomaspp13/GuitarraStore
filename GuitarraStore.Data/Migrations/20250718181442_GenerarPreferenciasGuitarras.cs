using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuitarraStore.Data.Migrations
{
    /// <inheritdoc />
    public partial class GenerarPreferenciasGuitarras : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EsMasVendida",
                table: "Guitarras",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "EstaEnOferta",
                table: "Guitarras",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Estilo",
                table: "Guitarras",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaIngreso",
                table: "Guitarras",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EsMasVendida",
                table: "Guitarras");

            migrationBuilder.DropColumn(
                name: "EstaEnOferta",
                table: "Guitarras");

            migrationBuilder.DropColumn(
                name: "Estilo",
                table: "Guitarras");

            migrationBuilder.DropColumn(
                name: "FechaIngreso",
                table: "Guitarras");
        }
    }
}
