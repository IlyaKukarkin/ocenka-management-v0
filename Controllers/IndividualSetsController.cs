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
    public class IndividualSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public IndividualSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/IndividualSet
        [HttpGet]
        public IEnumerable<ClientSetIndividual> GetClientSetIndividual()
        {
            IEnumerable<AddressSet> addresses = _context.AddressSet;
            IEnumerable<ClientSetIndividual> individuals = _context.ClientSetIndividual;
            AddressSet adr = new AddressSet();
            ClientSetIndividual ind = new ClientSetIndividual();

            for (int i = 0; i < individuals.Count(); i++)
            {
                adr = addresses.First(u => u.Id == individuals.ElementAt(i).AddressOfResidenceId);
                adr.ClientSetIndividual = null;
                individuals.ElementAt(i).AddressOfResidence = adr;
            }

            return individuals;
        }

        // GET: api/IndividualSet/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClientSetIndividual([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clientSetIndividual = await _context.ClientSetIndividual.FindAsync(id);

            if (clientSetIndividual == null)
            {
                return NotFound();
            }

            return Ok(clientSetIndividual);
        }

        // PUT: api/IndividualSet/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClientSetIndividual([FromRoute] int id, [FromBody] ClientSetIndividual clientSetIndividual)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != clientSetIndividual.Id)
            {
                return BadRequest();
            }

            _context.Entry(clientSetIndividual).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientSetIndividualExists(id))
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

        // POST: api/IndividualSet
        [HttpPost]
        public async Task<IActionResult> PostClientSetIndividual([FromBody] ClientSetIndividual clientSetIndividual)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ClientSetIndividual.Add(clientSetIndividual);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ClientSetIndividualExists(clientSetIndividual.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetClientSetIndividual", new { id = clientSetIndividual.Id }, clientSetIndividual);
        }

        // DELETE: api/IndividualSet/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClientSetIndividual([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clientSetIndividual = await _context.ClientSetIndividual.FindAsync(id);
            if (clientSetIndividual == null)
            {
                return NotFound();
            }

            _context.ClientSetIndividual.Remove(clientSetIndividual);
            await _context.SaveChangesAsync();

            return Ok(clientSetIndividual);
        }

        private bool ClientSetIndividualExists(int id)
        {
            return _context.ClientSetIndividual.Any(e => e.Id == id);
        }
    }
}