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
    public class UserSetsController : ControllerBase
    {
        OcenkaManagementContext _context = new OcenkaManagementContext();

        // GET: api/UserSets
        [HttpGet]
        public IEnumerable<UserSet> GetUserSet()
        {
            return _context.UserSet;
        }

        // GET: api/UserSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSet = await _context.UserSet.FindAsync(id);

            if (userSet == null)
            {
                return NotFound();
            }

            return Ok(userSet);
        }

        // PUT: api/UserSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserSet([FromRoute] int id, [FromBody] UserSet userSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userSet.Id)
            {
                return BadRequest();
            }

            _context.Entry(userSet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSetExists(id))
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

        // POST: api/UserSets
        [HttpPost]
        public async Task<IActionResult> PostUserSet([FromBody] UserSet userSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.UserSet.Add(userSet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserSet", new { id = userSet.Id }, userSet);
        }

        // DELETE: api/UserSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSet = await _context.UserSet.FindAsync(id);
            if (userSet == null)
            {
                return NotFound();
            }

            _context.UserSet.Remove(userSet);
            await _context.SaveChangesAsync();

            return Ok(userSet);
        }

        private bool UserSetExists(int id)
        {
            return _context.UserSet.Any(e => e.Id == id);
        }
    }
}