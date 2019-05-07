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
    public class ClientSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public ClientSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/ClientSets
        [HttpGet]
        public IEnumerable<ClientSet> GetClientSet()
        {
            return _context.ClientSet;
        }

        // GET: api/ClientSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClientSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clientSet = await _context.ClientSet.FindAsync(id);

            if (clientSet == null)
            {
                return NotFound();
            }

            return Ok(clientSet);
        }

        // PUT: api/ClientSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClientSet([FromRoute] int id, [FromBody] ClientSet clientSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != clientSet.Id)
            {
                return BadRequest();
            }

            _context.Entry(clientSet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientSetExists(id))
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

        // POST: api/ClientSets
        [HttpPost]
        public async Task<IActionResult> PostClientSet([FromBody] ClientSet clientSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ClientSet.Add(clientSet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClientSet", new { id = clientSet.Id }, clientSet);
        }

        // DELETE: api/ClientSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClientSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clientSet = await _context.ClientSet.FindAsync(id);
            if (clientSet == null)
            {
                return NotFound();
            }

            _context.ClientSet.Remove(clientSet);
            await _context.SaveChangesAsync();

            return Ok(clientSet);
        }

        private bool ClientSetExists(int id)
        {
            return _context.ClientSet.Any(e => e.Id == id);
        }
    }
}