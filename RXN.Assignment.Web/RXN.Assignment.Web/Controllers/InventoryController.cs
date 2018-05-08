using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RXN.Assignment.Web.DataAccess;
using System.Linq.Dynamic.Core;
using RXN.Assignment.Web.Models;

namespace RXN.Assignment.Web.Controllers
{
    [Produces("application/json")]
    [Route("api/Inventory")]
    public class InventoryController : Controller
    {
        private readonly RXNDBContext _context;

        public InventoryController(RXNDBContext context)
        {
            _context = context;
        }

        [HttpGet("Mockdata")]
        public IActionResult GetMockData()
        {
            var jsonData = new
            {
                total = 0,
                page = 1,
                records = 0,
                rows = new List<Object>()
            };

            return Ok(jsonData);
        }

        // GET: api/Inventory
        [HttpGet]
        public async Task<IActionResult> GetItemMasterInventory(int masterId,string sidx, string sord, int page, int rows)
        {
            var packSize = _context.ItemMaster.FirstOrDefault(m => m.ItemMasterIdPk == masterId)?.Impack ?? 0;

            int pageIndex = Convert.ToInt32(page) - 1;
            int pageSize = rows;

            var results = _context.ItemMasterInventory.Select(
                m => new InventoryItemDto
                {
                    Id = m.ItemMasterInventoryIdPk,
                    OnHand = m.ImiqtyOnHand,
                    OnHandPcs = PcsCaculate(m.ImiqtyOnHand, packSize),
                    Allocated = m.ImiqtyAllocated,
                    AllocatedPcs = PcsCaculate(m.ImiqtyAllocated, packSize),
                    Available = m.ImiqtyOnHand - m.ImiqtyAllocated,
                    AvailablePcs = PcsCaculate(m.ImiqtyOnHand - m.ImiqtyAllocated, packSize),
                    Location = m.ImisiteId
                });

            int totalRecords = results.Count();
            var totalPages = (int)Math.Ceiling((float)totalRecords / (float)rows);
            if (!string.IsNullOrEmpty(sidx))
            {
                results = results.OrderBy($"{sidx} {sord}");
            }
            results = results.Skip(pageIndex * pageSize).Take(pageSize);

            var jsonData = new
            {
                total = totalPages,
                page,
                records = totalRecords,
                rows = await results.ToListAsync()
            };

            return Ok(jsonData);
        }

        private decimal PcsCaculate(decimal quantity, int packSize)
        {
            return quantity * packSize;
        }
    }
}