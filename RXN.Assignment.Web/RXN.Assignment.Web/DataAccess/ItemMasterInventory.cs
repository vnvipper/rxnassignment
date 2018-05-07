using System;
using System.Collections.Generic;

namespace RXN.Assignment.Web.DataAccess
{
    public partial class ItemMasterInventory
    {
        public int ItemMasterInventoryIdPk { get; set; }
        public int ImiitemMasterIdFk { get; set; }
        public string ImisiteId { get; set; }
        public int ImiqtyOnHand { get; set; }
        public int ImiqtyAllocated { get; set; }

        public ItemMaster ImiitemMasterIdFkNavigation { get; set; }
    }
}
