using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class SalaryClass
    {
        public SalaryClass()
        {
            ContractsFlat = new HashSet<ContractSet>();
            ContractsCar = new HashSet<ContractSet>();
            ContractsParcel = new HashSet<ContractSet>();
        }

        public int Month { get; set; }
        public string Surname { get; set; }
        public string Name { get; set; }
        public string Patronymic { get; set; }
        public int ContractsCount { get; set; }
        public double Salary { get; set; }

        public ICollection<ContractSet> ContractsFlat { get; set; }
        public ICollection<ContractSet> ContractsCar { get; set; }
        public ICollection<ContractSet> ContractsParcel { get; set; }
    }
}
