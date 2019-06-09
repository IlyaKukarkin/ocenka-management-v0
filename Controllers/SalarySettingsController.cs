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
    public class SalarySettingsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public SalarySettingsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/SalarySettings
        [HttpGet]
        public IEnumerable<SalarySettingsSet> GetSalarySettingsSet()
        {
            return _context.SalarySettingsSet;
        }

        // GET: api/SalarySettings/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSalarySettingsSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var salarySettingsSet = await _context.SalarySettingsSet.FindAsync(id);

            if (salarySettingsSet == null)
            {
                return NotFound();
            }

            return Ok(salarySettingsSet);
        }

        // PUT: api/SalarySettings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSalarySettingsSet([FromRoute] int id, [FromBody] SalarySettingsSet salarySettingsSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != salarySettingsSet.Id)
            {
                return BadRequest();
            }

            _context.Entry(salarySettingsSet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalarySettingsSetExists(id))
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

        // POST: api/SalarySettings
        [HttpPost]
        public async Task<IActionResult> PostSalarySettingsSet([FromBody] SalarySettingsSet salarySettingsSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.SalarySettingsSet.Add(salarySettingsSet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSalarySettingsSet", new { id = salarySettingsSet.Id }, salarySettingsSet);
        }

        // DELETE: api/SalarySettings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSalarySettingsSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var salarySettingsSet = await _context.SalarySettingsSet.FindAsync(id);
            if (salarySettingsSet == null)
            {
                return NotFound();
            }

            _context.SalarySettingsSet.Remove(salarySettingsSet);
            await _context.SaveChangesAsync();

            return Ok(salarySettingsSet);
        }

        private bool SalarySettingsSetExists(int id)
        {
            return _context.SalarySettingsSet.Any(e => e.Id == id);
        }
    }
}