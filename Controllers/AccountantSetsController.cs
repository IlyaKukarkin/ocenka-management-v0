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
    public class AccountantSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public AccountantSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/AccountantSets
        [HttpGet]
        public IEnumerable<UserSetAccountant> GetUserSetAccountant()
        {
            return _context.UserSetAccountant;
        }

        // GET: api/AccountantSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserSetAccountant([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSetAccountant = await _context.UserSetAccountant.FindAsync(id);

            if (userSetAccountant == null)
            {
                return NotFound();
            }

            return Ok(userSetAccountant);
        }

        // PUT: api/AccountantSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserSetAccountant([FromRoute] int id, [FromBody] UserSetAccountant userSetAccountant)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userSetAccountant.Id)
            {
                return BadRequest();
            }

            _context.Entry(userSetAccountant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSetAccountantExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/AccountantSets
        [HttpPost]
        public async Task<IActionResult> PostUserSetAccountant([FromBody] UserSetAccountant userSetAccountant)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.UserSetAccountant.Add(userSetAccountant);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserSetAccountantExists(userSetAccountant.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserSetAccountant", new { id = userSetAccountant.Id }, userSetAccountant);
        }

        // DELETE: api/AccountantSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserSetAccountant([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSetAccountant = await _context.UserSetAccountant.FindAsync(id);
            if (userSetAccountant == null)
            {
                return NotFound();
            }

            _context.UserSetAccountant.Remove(userSetAccountant);
            await _context.SaveChangesAsync();

            return Ok(userSetAccountant);
        }

        private bool UserSetAccountantExists(int id)
        {
            return _context.UserSetAccountant.Any(e => e.Id == id);
        }
    }
}