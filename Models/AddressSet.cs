using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class AddressSet
    {
        public AddressSet()
        {
            ClientSetEntity = new HashSet<ClientSetEntity>();
            ClientSetIndividual = new HashSet<ClientSetIndividual>();
            ObjectSetFlat = new HashSet<ObjectSetFlat>();
        }

        public int Id { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string Street { get; set; }
        public int House { get; set; }
        public int NumberOfFlat { get; set; }

        public ICollection<ClientSetEntity> ClientSetEntity { get; set; }
        public ICollection<ClientSetIndividual> ClientSetIndividual { get; set; }
        public ICollection<ObjectSetFlat> ObjectSetFlat { get; set; }
    }
}
