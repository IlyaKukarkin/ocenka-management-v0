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
                adr = addresses.FirstOrDefault(u => u.Id == individuals.ElementAt(i).AddressOfResidenceId);
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

        [HttpPost("ToExcel")]
        public async Task<IActionResult> ToExcel([FromBody] Excel excel)
        {
            IEnumerable<ClientSetIndividual> clients = _context.ClientSetIndividual;
            IEnumerable<AddressSet> addresses = _context.AddressSet;
            List<ClientSetIndividual> clientsRes = new List<ClientSetIndividual>();
            ClientSetIndividual clnt = new ClientSetIndividual();
            AddressSet adr = new AddressSet();

            for (int i = 0; i < excel.Ids.Count(); i++)
            {
                clnt = clients.FirstOrDefault(u => u.Id == excel.Ids[i]);

                adr = addresses.FirstOrDefault(u => u.Id == clnt.AddressOfResidenceId);
                adr.ClientSetIndividual = null;
                clnt.AddressOfResidence = adr;

                clientsRes.Add(clnt);
            }

            var fileDownloadName = "Физ лица.xlsx";

            using (var package = createExcelPackage(clientsRes))
            {
                package.SaveAs(new FileInfo(Path.Combine(@"C:\Users\user\Downloads", fileDownloadName)));
            }
            return Ok();
        }

        private ExcelPackage createExcelPackage(IEnumerable<ClientSetIndividual> clients)
        {
            var package = new ExcelPackage();
            package.Workbook.Properties.Title = "Отчёт - клиенты";
            package.Workbook.Properties.Author = "Ocenka Management";
            package.Workbook.Properties.Subject = "Отчёт - клиенты";
            package.Workbook.Properties.Keywords = "Ocenka Management";


            var worksheet = package.Workbook.Worksheets.Add("Клиенты");

            //First add the headers
            worksheet.Cells[1, 1].Value = "Фамилия";
            worksheet.Cells[1, 2].Value = "Имя";
            worksheet.Cells[1, 3].Value = "Отчество";
            worksheet.Cells[1, 4].Value = "Серия паспорта";
            worksheet.Cells[1, 5].Value = "Номер паспорта";
            worksheet.Cells[1, 6].Value = "Дата рождения";
            worksheet.Cells[1, 7].Value = "Дата выдачи";
            worksheet.Cells[1, 8].Value = "Кем выдан";
            worksheet.Cells[1, 9].Value = "Код подразделения";
            worksheet.Cells[1, 10].Value = "Город";
            worksheet.Cells[1, 11].Value = "Район";
            worksheet.Cells[1, 12].Value = "Улица";
            worksheet.Cells[1, 13].Value = "Дом";
            worksheet.Cells[1, 14].Value = "Квартира";

            //Add values

            for (int i = 0; i < clients.Count(); i++)
            {
                worksheet.Cells[i + 2, 1].Value = clients.ElementAt(i).Surname;
                worksheet.Cells[i + 2, 2].Value = clients.ElementAt(i).Name;
                worksheet.Cells[i + 2, 3].Value = clients.ElementAt(i).Patronymic;
                worksheet.Cells[i + 2, 4].Value = clients.ElementAt(i).Series;
                worksheet.Cells[i + 2, 5].Value = clients.ElementAt(i).Number;
                worksheet.Cells[i + 2, 6].Value = clients.ElementAt(i).DateOfBirth.ToString("MM/dd/yyyy");
                worksheet.Cells[i + 2, 7].Value = clients.ElementAt(i).DateOfIssue.ToString("MM/dd/yyyy");
                worksheet.Cells[i + 2, 8].Value = clients.ElementAt(i).IssuedBy;
                worksheet.Cells[i + 2, 9].Value = clients.ElementAt(i).DivisionCode;
                worksheet.Cells[i + 2, 10].Value = clients.ElementAt(i).AddressOfResidence.City;
                worksheet.Cells[i + 2, 11].Value = clients.ElementAt(i).AddressOfResidence.District;
                worksheet.Cells[i + 2, 12].Value = clients.ElementAt(i).AddressOfResidence.Street;
                worksheet.Cells[i + 2, 13].Value = clients.ElementAt(i).AddressOfResidence.House;
                worksheet.Cells[i + 2, 14].Value = clients.ElementAt(i).AddressOfResidence.NumberOfFlat;
            }

            // Add to table / Add summary row
            var tbl = worksheet.Tables.Add(new ExcelAddressBase(fromRow: 1, fromCol: 1, toRow: clients.Count() + 1, toColumn: 14), "Data");
            tbl.ShowHeader = true;
            tbl.TableStyle = TableStyles.Medium15;

            // AutoFitColumns
            worksheet.Cells[1, 1, clients.Count() + 1, 14].AutoFitColumns();
            worksheet.Cells[1, 1, clients.Count() + 1, 14].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            return package;
        }
    }
}