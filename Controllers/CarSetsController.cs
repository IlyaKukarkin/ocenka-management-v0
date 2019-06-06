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
    public class CarSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public CarSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/CarSets
        [HttpGet]
        public IEnumerable<ObjectSetCar> GetObjectSetCar()
        {
            IEnumerable<ObjectSetCar> cars = _context.ObjectSetCar;
            IEnumerable<ObjectSet> objects = _context.ObjectSet;
            ObjectSetCar car = new ObjectSetCar();
            ObjectSet obj = new ObjectSet();

            for (int i = 0; i < cars.Count(); i++)
            {
                obj = objects.FirstOrDefault(u => u.Id == cars.ElementAt(i).Id);
                obj.ObjectSetCar = null;
                cars.ElementAt(i).IdNavigation = obj;
            }

            return cars;
        }

        // GET: api/CarSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetObjectSetCar([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSetCar = await _context.ObjectSetCar.FindAsync(id);

            if (objectSetCar == null)
            {
                return NotFound();
            }

            return Ok(objectSetCar);
        }

        // PUT: api/CarSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutObjectSetCar([FromRoute] int id, [FromBody] ObjectSetCar objectSetCar)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objectSetCar.Id)
            {
                return BadRequest();
            }

            _context.Entry(objectSetCar).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObjectSetCarExists(id))
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

        // POST: api/CarSets
        [HttpPost]
        public async Task<IActionResult> PostObjectSetCar([FromBody] ObjectSetCar objectSetCar)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ObjectSetCar.Add(objectSetCar);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ObjectSetCarExists(objectSetCar.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetObjectSetCar", new { id = objectSetCar.Id }, objectSetCar);
        }

        // DELETE: api/CarSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteObjectSetCar([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSetCar = await _context.ObjectSetCar.FindAsync(id);
            if (objectSetCar == null)
            {
                return NotFound();
            }

            _context.ObjectSetCar.Remove(objectSetCar);
            await _context.SaveChangesAsync();

            return Ok(objectSetCar);
        }

        private bool ObjectSetCarExists(int id)
        {
            return _context.ObjectSetCar.Any(e => e.Id == id);
        }
    }
}