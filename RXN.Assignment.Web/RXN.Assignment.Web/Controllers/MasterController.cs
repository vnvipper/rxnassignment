using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RXN.Assignment.Web.DataAccess;
using RXN.Assignment.Web.Models;

namespace RXN.Assignment.Web.Controllers
{
    [Produces("application/json")]
    [Route("api/Master")]
    public class MasterController : Controller
    {
        private readonly RXNDBContext _context;

        public MasterController(RXNDBContext context)
        {
            _context = context;
        }

        // GET: api/Master
        [HttpGet]
        public IEnumerable<int> GetItemMaster()
        {
            return _context.ItemMaster.Select(m=>m.ItemMasterIdPk);
        }

        // GET: api/Master/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetItemMaster([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var itemMaster = await _context.ItemMaster.SingleOrDefaultAsync(m => m.ItemMasterIdPk == id);

            if (itemMaster == null)
            {
                return NotFound();
            }

            var model = DataToModel(itemMaster);

            return Ok(model);
        }

        // PUT: api/Master/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItemMaster([FromRoute] int id, [FromBody] MasterItemDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != model.ProductNumber)
            {
                return BadRequest();
            }

            var itemMaster = ModelToData(model);
            _context.Entry(itemMaster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemMasterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Master
        [HttpPost]
        public async Task<IActionResult> PostItemMaster([FromBody] MasterItemDto item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }   

            var itemMaster = ModelToData(item);
            _context.ItemMaster.Add(itemMaster);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ItemMasterExists(itemMaster.ItemMasterIdPk))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetItemMaster", new { id = itemMaster.ItemMasterIdPk }, item);
        }

        #region Helpers
        private MasterItemDto DataToModel(ItemMaster itemMaster)
        {
            var model = new MasterItemDto
            {
                ProductNumber = itemMaster.ItemMasterIdPk,
                PackSize = itemMaster.Impack,
                Description = itemMaster.Imdescription,
                ProductImage = itemMaster.ImimageData != null
                    ? Convert.ToBase64String(itemMaster.ImimageData, 0, itemMaster.ImimageData.Length)
                    : null,
                IsHazardousMaterial = itemMaster.ImisHazardousMaterial,
                ExpirationDate = itemMaster.ImexpirationDate.ToString("MM/dd/yyyy"),
                CostCenterCode = itemMaster.ImcostCenterCode.ToString("####-##-##"),
                UnitPrice = itemMaster.ImunitPrice,
                Width = itemMaster.Imwidth,
                Length = itemMaster.Imlength,
                Height = itemMaster.Imheight,
                IsPrePack = itemMaster.ImisPrePack,
                PrePack = itemMaster.ImprePackStyle
            };
            return model;
        }

        private ItemMaster ModelToData(MasterItemDto model)
        {
            var data = new ItemMaster
            {
                ItemMasterIdPk = model.ProductNumber,
                Impack = model.PackSize,
                Imdescription = model.Description,
                ImimageData = !string.IsNullOrEmpty(model.ProductImage)
                    ? Convert.FromBase64String(model.ProductImage)
                    : null,
                ImisHazardousMaterial = model.IsHazardousMaterial,
                ImexpirationDate = DateTime.ParseExact(model.ExpirationDate, "MM/dd/yyyy", CultureInfo.InvariantCulture),
                ImcostCenterCode = int.Parse(model.CostCenterCode.Replace("-", "")),
                ImunitPrice = model.UnitPrice,
                Imwidth = model.Width,
                Imlength = model.Length,
                Imheight = model.Height,
                ImisPrePack = model.IsPrePack,
                ImprePackStyle = model.PrePack
            };
            return data;
        }

        private bool ItemMasterExists(int id)
        {
            return _context.ItemMaster.Any(e => e.ItemMasterIdPk == id);
        }
        #endregion
    }
}