using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class ClientSetIndividual
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Patronymic { get; set; }
        public int Series { get; set; }
        public int Number { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime DateOfIssue { get; set; }
        public int DivisionCode { get; set; }
        public string IssuedBy { get; set; }
        public int Id { get; set; }
        public int AddressOfResidenceId { get; set; }

        public AddressSet AddressOfResidence { get; set; }
        public ClientSet IdNavigation { get; set; }
    }
}
