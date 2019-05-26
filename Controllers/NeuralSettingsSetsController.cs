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
    public class NeuralSettingsSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public NeuralSettingsSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/NeuralSettingsSets
        [HttpGet]
        public IEnumerable<NeuralSettingsSet> GetNeuralSettingsSet()
        {
            return _context.NeuralSettingsSet;
        }

        // GET: api/NeuralSettingsSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNeuralSettingsSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var neuralSettingsSet = await _context.NeuralSettingsSet.FindAsync(id);

            if (neuralSettingsSet == null)
            {
                return NotFound();
            }

            return Ok(neuralSettingsSet);
        }

        // PUT: api/NeuralSettingsSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNeuralSettingsSet([FromRoute] int id, [FromBody] NeuralSettingsSet neuralSettingsSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != neuralSettingsSet.Id)
            {
                return BadRequest();
            }

            _context.Entry(neuralSettingsSet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NeuralSettingsSetExists(id))
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

        // POST: api/NeuralSettingsSets
        [HttpPost]
        public async Task<IActionResult> PostNeuralSettingsSet([FromBody] NeuralSettingsSet neuralSettingsSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.NeuralSettingsSet.Add(neuralSettingsSet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNeuralSettingsSet", new { id = neuralSettingsSet.Id }, neuralSettingsSet);
        }

        // DELETE: api/NeuralSettingsSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNeuralSettingsSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var neuralSettingsSet = await _context.NeuralSettingsSet.FindAsync(id);
            if (neuralSettingsSet == null)
            {
                return NotFound();
            }

            _context.NeuralSettingsSet.Remove(neuralSettingsSet);
            await _context.SaveChangesAsync();

            return Ok(neuralSettingsSet);
        }

        private bool NeuralSettingsSetExists(int id)
        {
            return _context.NeuralSettingsSet.Any(e => e.Id == id);
        }
    }
}