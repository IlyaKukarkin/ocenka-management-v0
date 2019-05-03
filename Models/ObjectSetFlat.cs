using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class ObjectSetFlat
    {
        public int NumberOfRooms { get; set; }
        public int Area { get; set; }
        public int Floor { get; set; }
        public int Id { get; set; }
        public int AddressId { get; set; }

        public AddressSet Address { get; set; }
        public ObjectSet IdNavigation { get; set; }
    }
}
