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
    public class AddressSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public AddressSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

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

        [HttpPost("ToExcel")]
        public async Task<IActionResult> ToExcel([FromBody] Excel excel)
        {
            IEnumerable<AddressSet> addresses = _context.AddressSet;
            List<AddressSet> addressRes = new List<AddressSet>();
            AddressSet usr = new AddressSet();

            for (int i = 0; i < excel.Ids.Count(); i++)
            {
                usr = addresses.First(u => u.Id == excel.Ids[i]);
                addressRes.Add(usr);
            }

            var fileDownloadName = "Адреса.xlsx";

            using (var package = createExcelPackage(addressRes))
            {
                package.SaveAs(new FileInfo(Path.Combine(@"C:\Users\user\Downloads", fileDownloadName)));
            }
            return Ok();
        }

        private ExcelPackage createExcelPackage(IEnumerable<AddressSet> addresses)
        {
            var package = new ExcelPackage();
            package.Workbook.Properties.Title = "Отчёт - адреса";
            package.Workbook.Properties.Author = "Ocenka Management";
            package.Workbook.Properties.Subject = "Отчёт - адреса";
            package.Workbook.Properties.Keywords = "Ocenka Management";


            var worksheet = package.Workbook.Worksheets.Add("Адреса");

            //First add the headers
            worksheet.Cells[1, 1].Value = "Город";
            worksheet.Cells[1, 2].Value = "Район";
            worksheet.Cells[1, 3].Value = "Улица";
            worksheet.Cells[1, 4].Value = "Дом";
            worksheet.Cells[1, 5].Value = "Квартира";

            //Add values

            for (int i = 0; i < addresses.Count(); i++)
            {
                worksheet.Cells[i + 2, 1].Value = addresses.ElementAt(i).City;
                worksheet.Cells[i + 2, 2].Value = addresses.ElementAt(i).District;
                worksheet.Cells[i + 2, 3].Value = addresses.ElementAt(i).Street;
                worksheet.Cells[i + 2, 4].Value = addresses.ElementAt(i).House;
                worksheet.Cells[i + 2, 5].Value = addresses.ElementAt(i).NumberOfFlat;
            }

            // Add to table / Add summary row
            var tbl = worksheet.Tables.Add(new ExcelAddressBase(fromRow: 1, fromCol: 1, toRow: addresses.Count() + 1, toColumn: 5), "Data");
            tbl.ShowHeader = true;
            tbl.TableStyle = TableStyles.Dark9;

            // AutoFitColumns
            worksheet.Cells[1, 1, addresses.Count() + 1, 5].AutoFitColumns();
            worksheet.Cells[1, 1, addresses.Count() + 1, 5].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            return package;
        }
    }
}