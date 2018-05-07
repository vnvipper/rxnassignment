using System;
using System.Collections.Generic;

namespace RXN.Assignment.Web.DataAccess
{
    public partial class ItemMaster
    {
        public ItemMaster()
        {
            ItemMasterInventory = new HashSet<ItemMasterInventory>();
        }

        public int ItemMasterIdPk { get; set; }
        public int Impack { get; set; }
        public string Imdescription { get; set; }
        public byte[] ImimageData { get; set; }
        public bool ImisHazardousMaterial { get; set; }
        public DateTime ImexpirationDate { get; set; }
        public decimal ImunitPrice { get; set; }
        public decimal Imwidth { get; set; }
        public decimal Imlength { get; set; }
        public decimal Imheight { get; set; }
        public bool ImisPrePack { get; set; }
        public string ImprePackStyle { get; set; }
        public int ImcostCenterCode { get; set; }

        public ICollection<ItemMasterInventory> ItemMasterInventory { get; set; }
    }
}
