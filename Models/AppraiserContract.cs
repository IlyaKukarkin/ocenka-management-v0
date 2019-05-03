using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class AppraiserContract
    {
        public int AppraiserId { get; set; }
        public int ContractId { get; set; }

        public UserSetAppraiser Appraiser { get; set; }
        public ContractSet Contract { get; set; }
    }
}
