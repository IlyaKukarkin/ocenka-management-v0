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
    public class ObjectSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public ObjectSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/ObjectSets
        [HttpGet]
        public IEnumerable<ObjectSet> GetObjectSet()
        {
            return _context.ObjectSet;
        }

        // GET: api/ObjectSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetObjectSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSet = await _context.ObjectSet.FindAsync(id);

            if (objectSet == null)
            {
                return NotFound();
            }

            return Ok(objectSet);
        }

        // PUT: api/ObjectSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutObjectSet([FromRoute] int id, [FromBody] ObjectSet objectSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objectSet.Id)
            {
                return BadRequest();
            }

            _context.Entry(objectSet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObjectSetExists(id))
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

        // POST: api/ObjectSets
        [HttpPost]
        public async Task<IActionResult> PostObjectSet([FromBody] ObjectSet objectSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ObjectSet.Add(objectSet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetObjectSet", new { id = objectSet.Id }, objectSet);
        }

        // DELETE: api/ObjectSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteObjectSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSet = await _context.ObjectSet.FindAsync(id);
            if (objectSet == null)
            {
                return NotFound();
            }

            _context.ObjectSet.Remove(objectSet);
            await _context.SaveChangesAsync();

            return Ok(objectSet);
        }

        private bool ObjectSetExists(int id)
        {
            return _context.ObjectSet.Any(e => e.Id == id);
        }
    }
}