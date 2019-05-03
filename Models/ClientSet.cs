using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class ClientSet
    {
        public ClientSet()
        {
            ContractSet = new HashSet<ContractSet>();
        }

        public int Id { get; set; }

        public ClientSetEntity ClientSetEntity { get; set; }
        public ClientSetIndividual ClientSetIndividual { get; set; }
        public ICollection<ContractSet> ContractSet { get; set; }
    }
}
