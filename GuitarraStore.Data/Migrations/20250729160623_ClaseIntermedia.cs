using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuitarraStore.Data.Migrations
{
    /// <inheritdoc />
    public partial class ClaseIntermedia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Factura_Guitarras_GuitarraId",
                table: "Factura");

            migrationBuilder.DropIndex(
                name: "IX_Factura_GuitarraId",
                table: "Factura");

            migrationBuilder.DropColumn(
                name: "GuitarraId",
                table: "Factura");

            migrationBuilder.CreateTable(
                name: "GuitarraFactura",
                columns: table => new
                {
                    FacturaId = table.Column<int>(type: "int", nullable: false),
                    GuitarraId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuitarraFactura", x => new { x.FacturaId, x.GuitarraId });
                    table.ForeignKey(
                        name: "FK_GuitarraFactura_Factura_FacturaId",
                        column: x => x.FacturaId,
                        principalTable: "Factura",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuitarraFactura_Guitarras_GuitarraId",
                        column: x => x.GuitarraId,
                        principalTable: "Guitarras",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GuitarraFactura_GuitarraId",
                table: "GuitarraFactura",
                column: "GuitarraId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GuitarraFactura");

            migrationBuilder.AddColumn<int>(
                name: "GuitarraId",
                table: "Factura",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Factura_GuitarraId",
                table: "Factura",
                column: "GuitarraId");

            migrationBuilder.AddForeignKey(
                name: "FK_Factura_Guitarras_GuitarraId",
                table: "Factura",
                column: "GuitarraId",
                principalTable: "Guitarras",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
