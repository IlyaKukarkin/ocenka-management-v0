using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class UserSetAccountant
    {
        public double Salary { get; set; }
        public int Id { get; set; }

        public UserSet IdNavigation { get; set; }
    }
}
