using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RXN.Assignment.Web.Models
{
    public class InventoryItemDto
    {
        public int Id { get; set; } 
        public string Location { get; set; }
        public decimal OnHand { get; set; }
        public decimal OnHandPcs { get; set; }
        public decimal Allocated { get; set; }
        public decimal AllocatedPcs { get; set; }
        public decimal Available { get; set; }
        public decimal AvailablePcs { get; set; }
    }
}
