using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class ObjectSetCar
    {
        public string Mark { get; set; }
        public string Model { get; set; }
        public string LicenseNumber { get; set; }
        public int Year { get; set; }
        public int Id { get; set; }

        public ObjectSet IdNavigation { get; set; }
    }
}
