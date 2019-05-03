using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class UserSetDirector
    {
        public double Salary { get; set; }
        public int Id { get; set; }

        public UserSet IdNavigation { get; set; }
    }
}
