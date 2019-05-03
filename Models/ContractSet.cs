using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class ContractSet
    {
        public ContractSet()
        {
            AppraiserContract = new HashSet<AppraiserContract>();
        }

        public int Id { get; set; }
        public double ContractSumm { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime FinishDate { get; set; }
        public double Prepaid { get; set; }
        public string Number { get; set; }
        public string Stage { get; set; }
        public int ObjectId { get; set; }
        public int ClientId { get; set; }

        public ClientSet Client { get; set; }
        public ObjectSet Object { get; set; }
        public ICollection<AppraiserContract> AppraiserContract { get; set; }
    }
}
