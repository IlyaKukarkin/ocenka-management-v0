using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ocenka_management.Models;

namespace ocenka_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public LoginController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // POST: api/Login
        [HttpPost]
        public ResponseClass Login([FromBody] LoginClass loginClass)
        {
            IEnumerable<UserSet> users = _context.UserSet;
            UserSet usr = new UserSet();
            ResponseClass result = new ResponseClass();

            usr = users.FirstOrDefault(u => u.Login == loginClass.Login && u.Password == loginClass.Password);

            if (usr == null)
            {
                result.Role = 0;
                result.Name = "";
            } else
            {
                result.Role = usr.RoleId;
                result.Name = usr.Name + "!";
            }

            return result;
        }
    }

    public class LoginClass
    {
        public string Login { get; set; }
        public string Password { get; set; }        
    }

    public class ResponseClass
    {
        public int Role { get; set; }
        public string Name { get; set; }
    }
}