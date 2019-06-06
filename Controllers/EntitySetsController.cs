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
    public class EntitySetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public EntitySetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/EntitieSets
        [HttpGet]
        public IEnumerable<ClientSetEntity> GetClientSetEntity()
        {
            return _context.ClientSetEntity;
        }

        // GET: api/EntitieSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClientSetEntity([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clientSetEntity = await _context.ClientSetEntity.FindAsync(id);

            if (clientSetEntity == null)
            {
                return NotFound();
            }

            return Ok(clientSetEntity);
        }

        // PUT: api/EntitieSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClientSetEntity([FromRoute] int id, [FromBody] ClientSetEntity clientSetEntity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != clientSetEntity.Id)
            {
                return BadRequest();
            }

            _context.Entry(clientSetEntity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientSetEntityExists(id))
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

        // POST: api/EntitieSets
        [HttpPost]
        public async Task<IActionResult> PostClientSetEntity([FromBody] ClientSetEntity clientSetEntity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ClientSetEntity.Add(clientSetEntity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ClientSetEntityExists(clientSetEntity.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetClientSetEntity", new { id = clientSetEntity.Id }, clientSetEntity);
        }

        // DELETE: api/EntitieSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClientSetEntity([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clientSetEntity = await _context.ClientSetEntity.FindAsync(id);
            if (clientSetEntity == null)
            {
                return NotFound();
            }

            _context.ClientSetEntity.Remove(clientSetEntity);
            await _context.SaveChangesAsync();

            return Ok(clientSetEntity);
        }

        private bool ClientSetEntityExists(int id)
        {
            return _context.ClientSetEntity.Any(e => e.Id == id);
        }
    }
}