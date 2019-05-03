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
    public class AddressSetsController : ControllerBase
    {
        OcenkaManagementContext _context = new OcenkaManagementContext();

        // GET: api/AddressSets
        [HttpGet]
        public IEnumerable<AddressSet> GetAddressSet()
        {
            return _context.AddressSet;
        }

        // GET: api/AddressSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAddressSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var addressSet = await _context.AddressSet.FindAsync(id);

            if (addressSet == null)
            {
                return NotFound();
            }

            return Ok(addressSet);
        }

        // PUT: api/AddressSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAddressSet([FromRoute] int id, [FromBody] AddressSet addressSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != addressSet.Id)
            {
                return BadRequest();
            }

            _context.Entry(addressSet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AddressSetExists(id))
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

        // POST: api/AddressSets
        [HttpPost]
        public async Task<IActionResult> PostAddressSet([FromBody] AddressSet addressSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.AddressSet.Add(addressSet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAddressSet", new { id = addressSet.Id }, addressSet);
        }

        // DELETE: api/AddressSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddressSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var addressSet = await _context.AddressSet.FindAsync(id);
            if (addressSet == null)
            {
                return NotFound();
            }

            _context.AddressSet.Remove(addressSet);
            await _context.SaveChangesAsync();

            return Ok(addressSet);
        }

        private bool AddressSetExists(int id)
        {
            return _context.AddressSet.Any(e => e.Id == id);
        }
    }
}