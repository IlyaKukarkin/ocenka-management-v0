using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class UserSetAppraiser
    {
        public UserSetAppraiser()
        {
            AppraiserContract = new HashSet<AppraiserContract>();
        }

        public string Position { get; set; }
        public int Id { get; set; }

        public UserSet IdNavigation { get; set; }
        public ICollection<AppraiserContract> AppraiserContract { get; set; }
    }
}
