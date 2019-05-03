using System;
using System.Collections.Generic;

namespace ocenka_management.Models
{
    public partial class UserSet
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Patronymic { get; set; }
        public DateTime WorksSince { get; set; }
        public DateTime Birthday { get; set; }
        public int RoleId { get; set; }

        public RolesSet Role { get; set; }
        public UserSetAccountant UserSetAccountant { get; set; }
        public UserSetAppraiser UserSetAppraiser { get; set; }
        public UserSetDirector UserSetDirector { get; set; }
    }
}
