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
    public class ParcelSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public ParcelSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/ParcelSets
        [HttpGet]
        public IEnumerable<ObjectSetParcel> GetObjectSetParcel()
        {
            IEnumerable<ObjectSetParcel> parcels = _context.ObjectSetParcel;
            IEnumerable<ObjectSet> objects = _context.ObjectSet;
            ObjectSetParcel prc = new ObjectSetParcel();
            ObjectSet obj = new ObjectSet();

            for (int i = 0; i < parcels.Count(); i++)
            {
                obj = objects.FirstOrDefault(u => u.Id == parcels.ElementAt(i).Id);
                obj.ObjectSetParcel = null;
                parcels.ElementAt(i).IdNavigation = obj;
            }

            return parcels;
        }

        // GET: api/ParcelSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetObjectSetParcel([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSetParcel = await _context.ObjectSetParcel.FindAsync(id);

            if (objectSetParcel == null)
            {
                return NotFound();
            }

            return Ok(objectSetParcel);
        }

        // PUT: api/ParcelSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutObjectSetParcel([FromRoute] int id, [FromBody] ObjectSetParcel objectSetParcel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objectSetParcel.Id)
            {
                return BadRequest();
            }

            _context.Entry(objectSetParcel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObjectSetParcelExists(id))
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

        // POST: api/ParcelSets
        [HttpPost]
        public async Task<IActionResult> PostObjectSetParcel([FromBody] ObjectSetParcel objectSetParcel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ObjectSetParcel.Add(objectSetParcel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ObjectSetParcelExists(objectSetParcel.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetObjectSetParcel", new { id = objectSetParcel.Id }, objectSetParcel);
        }

        // DELETE: api/ParcelSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteObjectSetParcel([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSetParcel = await _context.ObjectSetParcel.FindAsync(id);
            if (objectSetParcel == null)
            {
                return NotFound();
            }

            _context.ObjectSetParcel.Remove(objectSetParcel);
            await _context.SaveChangesAsync();

            return Ok(objectSetParcel);
        }

        private bool ObjectSetParcelExists(int id)
        {
            return _context.ObjectSetParcel.Any(e => e.Id == id);
        }
    }
}