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
    public class ContractSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public ContractSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/ContractSets
        [HttpGet]
        public IEnumerable<ContractSet> GetContractSet()
        {
            IEnumerable<ContractSet> contracts = _context.ContractSet;
            IEnumerable<ObjectSet> objects = _context.ObjectSet;
            IEnumerable<ObjectSetFlat> flats = _context.ObjectSetFlat;
            IEnumerable<ObjectSetCar> cars = _context.ObjectSetCar;
            IEnumerable<ObjectSetParcel> parcels = _context.ObjectSetParcel;
            IEnumerable<ClientSet> clients = _context.ClientSet;
            IEnumerable<ClientSetIndividual> clientsIndiv = _context.ClientSetIndividual;
            IEnumerable<ClientSetEntity> clientsEnt = _context.ClientSetEntity;
            IEnumerable<UserSetAppraiser> apraisers = _context.UserSetAppraiser;
            IEnumerable<AppraiserContract> apraisersContract = _context.AppraiserContract;
            IEnumerable<UserSet> users = _context.UserSet;
            IEnumerable<AddressSet> addresses = _context.AddressSet;
            ContractSet cntr = new ContractSet();
            ClientSet clnt = new ClientSet();
            ClientSetIndividual indv = new ClientSetIndividual();
            ClientSetEntity ent = new ClientSetEntity();
            ObjectSet obj = new ObjectSet();
            ObjectSetFlat flt = new ObjectSetFlat();
            ObjectSetCar cr = new ObjectSetCar();
            ObjectSetParcel prcl = new ObjectSetParcel();
            UserSetAppraiser apr = new UserSetAppraiser();
            AppraiserContract aprCntr = new AppraiserContract();
            UserSet usr = new UserSet();
            AddressSet adr = new AddressSet();

            for (int i = 0; i < contracts.Count(); i++)
            {
                clnt = clients.FirstOrDefault(u => u.Id == contracts.ElementAt(i).ClientId);
                clnt.ContractSet = null;
                indv = clientsIndiv.FirstOrDefault(u => u.Id == clnt.Id);
                ent = clientsEnt.FirstOrDefault(u => u.Id == clnt.Id);
                if (indv != null)
                {
                    indv.IdNavigation = null;
                    adr = addresses.FirstOrDefault(u => u.Id == indv.AddressOfResidenceId);
                    adr.ClientSetIndividual = null;
                    indv.AddressOfResidence = adr;
                    clnt.ClientSetIndividual = indv;
                } else
                {
                    ent.IdNavigation = null;
                    adr = addresses.FirstOrDefault(u => u.Id == ent.LegalAddressId);
                    adr.ClientSetEntity = null;
                    ent.LegalAddress = adr;
                    clnt.ClientSetEntity = ent;
                }
                contracts.ElementAt(i).Client = clnt;

                obj = objects.FirstOrDefault(u => u.Id == contracts.ElementAt(i).ObjectId);
                obj.ContractSet = null;
                flt = flats.FirstOrDefault(u => u.Id == obj.Id);
                cr = cars.FirstOrDefault(u => u.Id == obj.Id);
                prcl = parcels.FirstOrDefault(u => u.Id == obj.Id);
                if (flt != null)
                {
                    flt.IdNavigation = null;
                    adr = addresses.FirstOrDefault(u => u.Id == flt.AddressId);
                    adr.ObjectSetFlat = null;
                    flt.Address = adr;
                    obj.ObjectSetFlat = flt;
                }
                else
                {
                    if (prcl != null)
                    {
                        prcl.IdNavigation = null;
                        obj.ObjectSetParcel = prcl;
                    }
                    else
                    {
                        cr.IdNavigation = null;
                        obj.ObjectSetCar = cr;
                    }
                }
                contracts.ElementAt(i).Object = obj;

                aprCntr = apraisersContract.FirstOrDefault(u => u.ContractId == contracts.ElementAt(i).Id);
                apr = apraisers.FirstOrDefault(u => u.Id == aprCntr.AppraiserId);
                apr.AppraiserContract = null;
                usr = users.FirstOrDefault(u => u.Id == apr.Id);
                usr.UserSetAppraiser = null;
                apr.IdNavigation = usr;
                aprCntr.Appraiser = apr;
                aprCntr.Contract = null;

                AppraiserContract[] arr = new AppraiserContract[1];
                arr[0] = aprCntr;
                contracts.ElementAt(i).AppraiserContract = arr;
            }

            return contracts;
        }

        // GET: api/ContractSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetContractSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contractSet = await _context.ContractSet.FindAsync(id);

            if (contractSet == null)
            {
                return NotFound();
            }

            return Ok(contractSet);
        }

        // PUT: api/ContractSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContractSet([FromRoute] int id, [FromBody] ContractSet contractSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contractSet.Id)
            {
                return BadRequest();
            }

            _context.Entry(contractSet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContractSetExists(id))
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

        // POST: api/ContractSets
        [HttpPost]
        public async Task<IActionResult> PostContractSet([FromBody] ContractSet contractSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ContractSet.Add(contractSet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContractSet", new { id = contractSet.Id }, contractSet);
        }

        // DELETE: api/ContractSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContractSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contractSet = await _context.ContractSet.FindAsync(id);
            if (contractSet == null)
            {
                return NotFound();
            }

            _context.ContractSet.Remove(contractSet);
            await _context.SaveChangesAsync();

            return Ok(contractSet);
        }

        private bool ContractSetExists(int id)
        {
            return _context.ContractSet.Any(e => e.Id == id);
        }
    }
}