using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RXN.Assignment.Web.Models
{
    public class MasterItemDto
    {
        [Display(Name = "Product Number")]
        [Required]
        public int ProductNumber { get; set; }

        [Display(Name = "Product Number")]
        [Required]
        public int PackSize { get; set; }

        [Display(Name = "Product Number")]
        public string Description { get; set; }

        [Display(Name = "Product Image")]
        public string ProductImage { get; set; }

        public bool IsHazardousMaterial { get; set; }

        [Display(Name = "Cost Center Code")]
        [Required]
        [RegularExpression(@"^[0-9]{4}-[0-9]{2}-[0-9]{2}$", ErrorMessage = "Invalid format. Correct format is ####-##-##")]
        public string CostCenterCode { get; set; }

        [Display(Name = "Expiration Date")]
        [Required]
        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy}", ApplyFormatInEditMode = true)]
        [RegularExpression(@"^(((0[1-9]|1[012])/(0[1-9]|1\d|2[0-8])|(0[13456789]|1[012])/(29|30)|(0[13578]|1[02])/31)/[2-9]\d{3}|02/29/(([2-9]\d)(0[48]|[2468][048]|[13579][26])|(([2468][048]|[3579][26])00)))$", ErrorMessage = "Invalid date format (MM/dd/yyyy)")]
        public string ExpirationDate { get; set; }

        [Display(Name = "Unit Price")]
        [Required]
        [RegularExpression(@"^\d+.?\d{0,2}$", ErrorMessage = "Invalid Unit Price; Maximum Two Decimal Points.")]
        public decimal UnitPrice { get; set; }

        [Display(Name = "Width")]
        [Required]
        [RegularExpression(@"^\d+.?\d{0,2}$", ErrorMessage = "Invalid Width; Maximum Two Decimal Points.")]
        public decimal Width { get; set; }

        [Display(Name = "Length")]
        [Required]
        [RegularExpression(@"^\d+.?\d{0,2}$", ErrorMessage = "Invalid Length; Maximum Two Decimal Points.")]
        public decimal Length { get; set; }

        [Display(Name = "Height")]
        [Required]
        [RegularExpression(@"^\d+.?\d{0,2}$", ErrorMessage = "Invalid Height; Maximum Two Decimal Points.")]
        public decimal Height { get; set; }

        [Display(Name = "Cube")]
        [Required]
        [RegularExpression(@"^\d+.?\d{0,3}$", ErrorMessage = "Invalid Height; Maximum Three Decimal Points.")]
        public decimal Cube => Width * Length * Height;
        public bool IsPrePack { get; set; }

        [Display(Name = "Pre Pack")]
        public string PrePack { get; set; }

        public string ImagePreview =>
            !string.IsNullOrEmpty(ProductImage) ? "data:image/png;base64," + ProductImage : null;
    }
}
