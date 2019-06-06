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
    public class AppraiserContractsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public AppraiserContractsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/AppraiserContracts
        [HttpGet]
        public IEnumerable<AppraiserContract> GetAppraiserContract()
        {
            return _context.AppraiserContract;
        }

        // GET: api/AppraiserContracts/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppraiserContract([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IEnumerable<AppraiserContract> aprContr = _context.AppraiserContract;
            AppraiserContract apr = new AppraiserContract();

            for (int i = 0; i < aprContr.Count(); i++)
            {
                if (aprContr.ElementAt(i).ContractId == id)
                {
                    apr = aprContr.ElementAt(i);
                    return Ok(apr);
                }
            }

            if (apr == null)
            {
                return NotFound();
            }

            return NotFound();
        }

        // PUT: api/AppraiserContracts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppraiserContract([FromRoute] int id, [FromBody] AppraiserContract appraiserContract)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != appraiserContract.ContractId)
            {
                return BadRequest();
            }

            IEnumerable<AppraiserContract> aprContr = _context.AppraiserContract;
            AppraiserContract apr = new AppraiserContract();

            for (int i = 0; i < aprContr.Count(); i++)
            {
                if (aprContr.ElementAt(i).ContractId == id)
                {
                    apr = aprContr.ElementAt(i);
                    break;
                }
            }

            _context.AppraiserContract.Remove(apr);
            _context.AppraiserContract.Add(appraiserContract);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppraiserContractExists(id))
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

        // POST: api/AppraiserContracts
        [HttpPost]
        public async Task<IActionResult> PostAppraiserContract([FromBody] AppraiserContract appraiserContract)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.AppraiserContract.Add(appraiserContract);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (AppraiserContractExists(appraiserContract.AppraiserId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetAppraiserContract", new { id = appraiserContract.AppraiserId }, appraiserContract);
        }

        // DELETE: api/AppraiserContracts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppraiserContract([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var appraiserContract = await _context.AppraiserContract.FindAsync(id);
            if (appraiserContract == null)
            {
                return NotFound();
            }

            _context.AppraiserContract.Remove(appraiserContract);
            await _context.SaveChangesAsync();

            return Ok(appraiserContract);
        }

        private bool AppraiserContractExists(int id)
        {
            return _context.AppraiserContract.Any(e => e.AppraiserId == id);
        }
    }
}