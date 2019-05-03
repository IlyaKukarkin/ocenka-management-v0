using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class ObjectSet
    {
        public ObjectSet()
        {
            ContractSet = new HashSet<ContractSet>();
        }

        public int Id { get; set; }
        public long CadastralNumber { get; set; }
        public string AimOfEvaluation { get; set; }

        public ObjectSetCar ObjectSetCar { get; set; }
        public ObjectSetFlat ObjectSetFlat { get; set; }
        public ObjectSetParcel ObjectSetParcel { get; set; }
        public ICollection<ContractSet> ContractSet { get; set; }
    }
}
