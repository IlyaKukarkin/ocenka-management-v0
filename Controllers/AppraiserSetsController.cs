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
    public class AppraiserSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public AppraiserSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/AppraisersSet
        [HttpGet]
        public IEnumerable<UserSetAppraiser> GetUserSetAppraiser()
        {
            IEnumerable<UserSet> users = _context.UserSet;
            IEnumerable<UserSetAppraiser> appraisers = _context.UserSetAppraiser;
            UserSet usr = new UserSet();
            UserSetAppraiser apr = new UserSetAppraiser();

            for (int i = 0; i < appraisers.Count(); i++)
            {
                usr = users.First(u => u.Id == appraisers.ElementAt(i).Id);
                usr.UserSetAppraiser = null;
                appraisers.ElementAt(i).IdNavigation = usr;
            }

            return appraisers;
        }

        // GET: api/AppraisersSet/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserSetAppraiser([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSetAppraiser = await _context.UserSetAppraiser.FindAsync(id);

            if (userSetAppraiser == null)
            {
                return NotFound();
            }

            return Ok(userSetAppraiser);
        }

        // PUT: api/AppraisersSet/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserSetAppraiser([FromRoute] int id, [FromBody] UserSetAppraiser userSetAppraiser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userSetAppraiser.Id)
            {
                return BadRequest();
            }

            _context.Entry(userSetAppraiser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSetAppraiserExists(id))
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

        // POST: api/AppraisersSet
        [HttpPost]
        public async Task<IActionResult> PostUserSetAppraiser([FromBody] UserSetAppraiser userSetAppraiser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.UserSetAppraiser.Add(userSetAppraiser);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserSetAppraiserExists(userSetAppraiser.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserSetAppraiser", new { id = userSetAppraiser.Id }, userSetAppraiser);
        }

        // DELETE: api/AppraisersSet/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserSetAppraiser([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSetAppraiser = await _context.UserSetAppraiser.FindAsync(id);
            if (userSetAppraiser == null)
            {
                return NotFound();
            }

            _context.UserSetAppraiser.Remove(userSetAppraiser);
            await _context.SaveChangesAsync();

            return Ok(userSetAppraiser);
        }

        private bool UserSetAppraiserExists(int id)
        {
            return _context.UserSetAppraiser.Any(e => e.Id == id);
        }
    }
}