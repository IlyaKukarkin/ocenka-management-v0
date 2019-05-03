using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class RolesSet
    {
        public RolesSet()
        {
            UserSet = new HashSet<UserSet>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<UserSet> UserSet { get; set; }
    }
}
