using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class ClientSetEntity
    {
        public string CompanyName { get; set; }
        public long Bin { get; set; }
        public long Inn { get; set; }
        public string MailAddress { get; set; }
        public string PaymentAccount { get; set; }
        public int Id { get; set; }
        public int LegalAddressId { get; set; }

        public ClientSet IdNavigation { get; set; }
        public AddressSet LegalAddress { get; set; }
    }
}
