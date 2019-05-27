using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class NeuralSettingsSet
    {
        public int Id { get; set; }
        public double RefinancingRate { get; set; }
        public double AverageSalary { get; set; }
        public double Gdp { get; set; }
        public double Rts { get; set; }
        public double DollarPrice { get; set; }
        public double BrentPrice { get; set; }
        public double EstateBuilding { get; set; }
        public double CreditsAmount { get; set; }
    }
}
