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
    public class DirectorSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public DirectorSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/DirectorSet
        [HttpGet]
        public IEnumerable<UserSetDirector> GetUserSetDirector()
        {
            return _context.UserSetDirector;
        }

        // GET: api/DirectorSet/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserSetDirector([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSetDirector = await _context.UserSetDirector.FindAsync(id);

            if (userSetDirector == null)
            {
                return NotFound();
            }

            return Ok(userSetDirector);
        }

        // PUT: api/DirectorSet/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserSetDirector([FromRoute] int id, [FromBody] UserSetDirector userSetDirector)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userSetDirector.Id)
            {
                return BadRequest();
            }

            _context.Entry(userSetDirector).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSetDirectorExists(id))
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

        // POST: api/DirectorSet
        [HttpPost]
        public async Task<IActionResult> PostUserSetDirector([FromBody] UserSetDirector userSetDirector)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.UserSetDirector.Add(userSetDirector);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserSetDirectorExists(userSetDirector.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserSetDirector", new { id = userSetDirector.Id }, userSetDirector);
        }

        // DELETE: api/DirectorSet/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserSetDirector([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSetDirector = await _context.UserSetDirector.FindAsync(id);
            if (userSetDirector == null)
            {
                return NotFound();
            }

            _context.UserSetDirector.Remove(userSetDirector);
            await _context.SaveChangesAsync();

            return Ok(userSetDirector);
        }

        private bool UserSetDirectorExists(int id)
        {
            return _context.UserSetDirector.Any(e => e.Id == id);
        }
    }
}