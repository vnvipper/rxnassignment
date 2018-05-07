using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RXN.Assignment.Web.DataAccess;

namespace RXN.Assignment.Web
{
    public static class DbInitializer
    {
        public static void Initialize(RXNDBContext context)
        {
            context.Database.EnsureCreated();

            // Look for any students.
            if (context.ItemMaster.Any())
            {
                return;   // DB has been seeded
            }

            var itemMasters = new[]
            {
                new ItemMaster
                {
                    ItemMasterIdPk = 1,
                    Impack = 12,
                    Imdescription = "This is sample description for item 1",
                    ImimageData = null,
                    ImisHazardousMaterial = true,
                    ImexpirationDate = DateTime.Now,
                    ImunitPrice = 9.1m,
                    Imwidth = 2m,
                    Imheight = 3m,
                    Imlength = 4m,
                    ImisPrePack = true,
                    ImprePackStyle = "Solid Style",
                    ImcostCenterCode = 12345678,
                    ItemMasterInventory = new List<ItemMasterInventory>
                    {
                        new ItemMasterInventory
                        {
                            ImisiteId = "CET",
                            ImiqtyOnHand = 10,
                            ImiqtyAllocated = 3
                        },
                        new ItemMasterInventory
                        {
                            ImisiteId = "SEA",
                            ImiqtyOnHand = 20,
                            ImiqtyAllocated = 10
                        }
                    }
                },
                new ItemMaster
                {
                    ItemMasterIdPk = 2,
                    Impack = 8,
                    Imdescription = "This is sample description for item 2",
                    ImimageData = null,
                    ImisHazardousMaterial = true,
                    ImexpirationDate = DateTime.Now,
                    ImunitPrice = 10.5m,
                    Imwidth = 5,
                    Imheight = 7,
                    Imlength = 6,
                    ImisPrePack = false,
                    ImprePackStyle = null,
                    ImcostCenterCode = 95638645,
                    ItemMasterInventory = new List<ItemMasterInventory>
                    {
                        new ItemMasterInventory
                        {
                            ImisiteId = "MCT",
                            ImiqtyOnHand = 10,
                            ImiqtyAllocated = 3
                        },
                        new ItemMasterInventory
                        {
                            ImisiteId = "BNA",
                            ImiqtyOnHand = 20,
                            ImiqtyAllocated = 10
                        }
                    }
                }
            };

            foreach (var item in itemMasters)
            {
                context.ItemMaster.Add(item);
            }
            context.SaveChanges();
        }
    }
}
