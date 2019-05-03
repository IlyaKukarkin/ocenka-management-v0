using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class SalarySettingsSet
    {
        public int Id { get; set; }
        public double Car { get; set; }
        public double Flat { get; set; }
        public double Parcel { get; set; }
        public double CarPercent { get; set; }
        public double FlatPercent { get; set; }
        public double ParcelPercent { get; set; }
    }
}
