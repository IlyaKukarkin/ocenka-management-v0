using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class ObjectSetParcel
    {
        public int Area { get; set; }
        public string UsageType { get; set; }
        public int Id { get; set; }

        public ObjectSet IdNavigation { get; set; }
    }
}
