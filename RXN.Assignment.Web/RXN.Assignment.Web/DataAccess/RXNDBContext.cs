using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace RXN.Assignment.Web.DataAccess
{
    public partial class RXNDBContext : DbContext
    {
        public RXNDBContext(DbContextOptions<RXNDBContext> options) : base(options)
        {
        }
        public virtual DbSet<ItemMaster> ItemMaster { get; set; }
        public virtual DbSet<ItemMasterInventory> ItemMasterInventory { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ItemMaster>(entity =>
            {
                entity.HasKey(e => e.ItemMasterIdPk);

                entity.Property(e => e.ItemMasterIdPk)
                    .HasColumnName("ItemMasterID_PK")
                    .ValueGeneratedNever();

                entity.Property(e => e.ImcostCenterCode).HasColumnName("IMCostCenterCode");

                entity.Property(e => e.Imdescription).HasColumnName("IMDescription");

                entity.Property(e => e.ImexpirationDate)
                    .HasColumnName("IMExpirationDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.Imheight).HasColumnName("IMHeight");

                entity.Property(e => e.ImimageData)
                    .HasColumnName("IMImageData")
                    .HasColumnType("image");

                entity.Property(e => e.ImisHazardousMaterial).HasColumnName("IMIsHazardousMaterial");

                entity.Property(e => e.ImisPrePack).HasColumnName("IMIsPrePack");

                entity.Property(e => e.Imlength).HasColumnName("IMLength");

                entity.Property(e => e.Impack).HasColumnName("IMPack");

                entity.Property(e => e.ImprePackStyle)
                    .HasColumnName("IMPrePackStyle")
                    .HasMaxLength(250);

                entity.Property(e => e.ImunitPrice).HasColumnName("IMUnitPrice");

                entity.Property(e => e.Imwidth).HasColumnName("IMWidth");
            });

            modelBuilder.Entity<ItemMasterInventory>(entity =>
            {
                entity.HasKey(e => e.ItemMasterInventoryIdPk);

                entity.Property(e => e.ItemMasterInventoryIdPk).HasColumnName("ItemMasterInventoryID_PK");

                entity.Property(e => e.ImiitemMasterIdFk).HasColumnName("IMIItemMasterID_FK");

                entity.Property(e => e.ImiqtyAllocated).HasColumnName("IMIQtyAllocated");

                entity.Property(e => e.ImiqtyOnHand).HasColumnName("IMIQtyOnHand");

                entity.Property(e => e.ImisiteId)
                    .IsRequired()
                    .HasColumnName("IMISiteID")
                    .HasMaxLength(250);

                entity.HasOne(d => d.ImiitemMasterIdFkNavigation)
                    .WithMany(p => p.ItemMasterInventory)
                    .HasForeignKey(d => d.ImiitemMasterIdFk)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ItemMasterInventory_ItemMaster");
            });
        }
    }
}
