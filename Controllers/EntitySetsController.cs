using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ocenka_management.Models;
using System.IO;
using OfficeOpenXml;
using OfficeOpenXml.Table;

namespace ocenka_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntitySetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public EntitySetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/EntitieSets
        [HttpGet]
        public IEnumerable<ClientSetEntity> GetClientSetEntity()
        {
            IEnumerable<AddressSet> addresses = _context.AddressSet;
            IEnumerable<ClientSetEntity> entities = _context.ClientSetEntity;
            AddressSet adr = new AddressSet();
            ClientSetEntity ent = new ClientSetEntity();

            for (int i = 0; i < entities.Count(); i++)
            {
                adr = addresses.FirstOrDefault(u => u.Id == entities.ElementAt(i).LegalAddressId);
                adr.ClientSetEntity = null;
                entities.ElementAt(i).LegalAddress = adr;
            }

            return entities;
        }

        // GET: api/EntitieSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClientSetEntity([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clientSetEntity = await _context.ClientSetEntity.FindAsync(id);

            if (clientSetEntity == null)
            {
                return NotFound();
            }

            return Ok(clientSetEntity);
        }

        // PUT: api/EntitieSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClientSetEntity([FromRoute] int id, [FromBody] ClientSetEntity clientSetEntity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != clientSetEntity.Id)
            {
                return BadRequest();
            }

            _context.Entry(clientSetEntity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientSetEntityExists(id))
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

        // POST: api/EntitieSets
        [HttpPost]
        public async Task<IActionResult> PostClientSetEntity([FromBody] ClientSetEntity clientSetEntity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ClientSetEntity.Add(clientSetEntity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ClientSetEntityExists(clientSetEntity.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetClientSetEntity", new { id = clientSetEntity.Id }, clientSetEntity);
        }

        // DELETE: api/EntitieSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClientSetEntity([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var clientSetEntity = await _context.ClientSetEntity.FindAsync(id);
            if (clientSetEntity == null)
            {
                return NotFound();
            }

            _context.ClientSetEntity.Remove(clientSetEntity);
            await _context.SaveChangesAsync();

            return Ok(clientSetEntity);
        }

        private bool ClientSetEntityExists(int id)
        {
            return _context.ClientSetEntity.Any(e => e.Id == id);
        }

        [HttpPost("ToExcel")]
        public async Task<IActionResult> ToExcel([FromBody] Excel excel)
        {
            IEnumerable<ClientSetEntity> clients = _context.ClientSetEntity;
            IEnumerable<AddressSet> addresses = _context.AddressSet;
            List<ClientSetEntity> clientsRes = new List<ClientSetEntity>();
            ClientSetEntity clnt = new ClientSetEntity();
            AddressSet adr = new AddressSet();

            for (int i = 0; i < excel.Ids.Count(); i++)
            {
                clnt = clients.FirstOrDefault(u => u.Id == excel.Ids[i]);

                adr = addresses.FirstOrDefault(u => u.Id == clnt.LegalAddressId);
                adr.ClientSetEntity = null;
                clnt.LegalAddress = adr;

                clientsRes.Add(clnt);
            }

            var fileDownloadName = "Юрид лица.xlsx";

            using (var package = createExcelPackage(clientsRes))
            {
                package.SaveAs(new FileInfo(Path.Combine(@"C:\Users\user\Downloads", fileDownloadName)));
            }
            return Ok();
        }

        private ExcelPackage createExcelPackage(IEnumerable<ClientSetEntity> clients)
        {
            var package = new ExcelPackage();
            package.Workbook.Properties.Title = "Отчёт - клиенты";
            package.Workbook.Properties.Author = "Ocenka Management";
            package.Workbook.Properties.Subject = "Отчёт - клиенты";
            package.Workbook.Properties.Keywords = "Ocenka Management";


            var worksheet = package.Workbook.Worksheets.Add("Клиенты");

            //First add the headers
            worksheet.Cells[1, 1].Value = "Название компании";
            worksheet.Cells[1, 2].Value = "ОГРН";
            worksheet.Cells[1, 3].Value = "ИНН";
            worksheet.Cells[1, 4].Value = "Адрес почты";
            worksheet.Cells[1, 5].Value = "Расчётный счёт";
            worksheet.Cells[1, 6].Value = "Город";
            worksheet.Cells[1, 7].Value = "Район";
            worksheet.Cells[1, 8].Value = "Улица";
            worksheet.Cells[1, 9].Value = "Дом";
            worksheet.Cells[1, 10].Value = "Квартира";

            //Add values

            for (int i = 0; i < clients.Count(); i++)
            {
                worksheet.Cells[i + 2, 1].Value = clients.ElementAt(i).CompanyName;
                worksheet.Cells[i + 2, 2].Value = clients.ElementAt(i).Bin;
                worksheet.Cells[i + 2, 3].Value = clients.ElementAt(i).Inn;
                worksheet.Cells[i + 2, 4].Value = clients.ElementAt(i).MailAddress;
                worksheet.Cells[i + 2, 5].Value = clients.ElementAt(i).PaymentAccount;
                worksheet.Cells[i + 2, 6].Value = clients.ElementAt(i).LegalAddress.City;
                worksheet.Cells[i + 2, 7].Value = clients.ElementAt(i).LegalAddress.District;
                worksheet.Cells[i + 2, 8].Value = clients.ElementAt(i).LegalAddress.Street;
                worksheet.Cells[i + 2, 9].Value = clients.ElementAt(i).LegalAddress.House;
                worksheet.Cells[i + 2, 10].Value = clients.ElementAt(i).LegalAddress.NumberOfFlat;
            }

            // Add to table / Add summary row
            var tbl = worksheet.Tables.Add(new ExcelAddressBase(fromRow: 1, fromCol: 1, toRow: clients.Count() + 1, toColumn: 10), "Data");
            tbl.ShowHeader = true;
            tbl.TableStyle = TableStyles.Dark9;

            // AutoFitColumns
            worksheet.Cells[1, 1, clients.Count() + 1, 10].AutoFitColumns();
            worksheet.Cells[1, 1, clients.Count() + 1, 10].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            return package;
        }
    }
}