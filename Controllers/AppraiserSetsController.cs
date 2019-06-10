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
    public class AppraiserSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public AppraiserSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/AppraisersSet
        [HttpGet]
        public IEnumerable<UserSetAppraiser> GetUserSetAppraiser()
        {
            IEnumerable<UserSet> users = _context.UserSet;
            IEnumerable<UserSetAppraiser> appraisers = _context.UserSetAppraiser;
            UserSet usr = new UserSet();
            UserSetAppraiser apr = new UserSetAppraiser();

            for (int i = 0; i < appraisers.Count(); i++)
            {
                usr = users.FirstOrDefault(u => u.Id == appraisers.ElementAt(i).Id);
                usr.UserSetAppraiser = null;
                appraisers.ElementAt(i).IdNavigation = usr;
            }

            return appraisers;
        }

        // GET: api/AppraisersSet/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserSetAppraiser([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSetAppraiser = await _context.UserSetAppraiser.FindAsync(id);

            if (userSetAppraiser == null)
            {
                return NotFound();
            }

            return Ok(userSetAppraiser);
        }

        // PUT: api/AppraisersSet/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserSetAppraiser([FromRoute] int id, [FromBody] UserSetAppraiser userSetAppraiser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userSetAppraiser.Id)
            {
                return BadRequest();
            }

            _context.Entry(userSetAppraiser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSetAppraiserExists(id))
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

        // POST: api/AppraisersSet
        [HttpPost]
        public async Task<IActionResult> PostUserSetAppraiser([FromBody] UserSetAppraiser userSetAppraiser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.UserSetAppraiser.Add(userSetAppraiser);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserSetAppraiserExists(userSetAppraiser.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserSetAppraiser", new { id = userSetAppraiser.Id }, userSetAppraiser);
        }

        // DELETE: api/AppraisersSet/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserSetAppraiser([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSetAppraiser = await _context.UserSetAppraiser.FindAsync(id);
            if (userSetAppraiser == null)
            {
                return NotFound();
            }

            _context.UserSetAppraiser.Remove(userSetAppraiser);
            await _context.SaveChangesAsync();

            return Ok(userSetAppraiser);
        }

        private bool UserSetAppraiserExists(int id)
        {
            return _context.UserSetAppraiser.Any(e => e.Id == id);
        }

        [HttpPost("ToExcel")]
        public async Task<IActionResult> ToExcel([FromBody] Excel excel)
        {
            IEnumerable<UserSet> users = _context.UserSet;
            IEnumerable<UserSetAppraiser> appraisers = _context.UserSetAppraiser;
            List<UserSetAppraiser> appraisersRes = new List<UserSetAppraiser>();
            UserSet usr = new UserSet();
            UserSetAppraiser apr = new UserSetAppraiser();

            for (int i = 0; i < excel.Ids.Count(); i++)
            {
                usr = users.FirstOrDefault(u => u.Id == excel.Ids[i]);
                usr.UserSetAppraiser = null;
                apr = appraisers.FirstOrDefault(u => u.Id == excel.Ids[i]);
                apr.IdNavigation = usr;
                appraisersRes.Add(apr);
            }

            var fileDownloadName = "Оценщики.xlsx";

            using (var package = createExcelPackage(appraisersRes))
            {
                package.SaveAs(new FileInfo(Path.Combine(@"C:\Users\user\Downloads", fileDownloadName)));
            }
            return Ok();
        }

        private ExcelPackage createExcelPackage(IEnumerable<UserSetAppraiser> appraisers)
        {
            var package = new ExcelPackage();
            package.Workbook.Properties.Title = "Отчёт - оценщики";
            package.Workbook.Properties.Author = "Ocenka Management";
            package.Workbook.Properties.Subject = "Отчёт - оценщики";
            package.Workbook.Properties.Keywords = "Ocenka Management";


            var worksheet = package.Workbook.Worksheets.Add("Оценщики");

            //First add the headers
            worksheet.Cells[1, 1].Value = "Фамилия";
            worksheet.Cells[1, 2].Value = "Имя";
            worksheet.Cells[1, 3].Value = "Отчество";
            worksheet.Cells[1, 4].Value = "День рождения";
            worksheet.Cells[1, 5].Value = "Работает с";
            worksheet.Cells[1, 6].Value = "Категория";

            //Add values

            for (int i = 0; i < appraisers.Count(); i++)
            {
                worksheet.Cells[i + 2, 1].Value = appraisers.ElementAt(i).IdNavigation.Surname;
                worksheet.Cells[i + 2, 2].Value = appraisers.ElementAt(i).IdNavigation.Name;
                worksheet.Cells[i + 2, 3].Value = appraisers.ElementAt(i).IdNavigation.Patronymic;
                worksheet.Cells[i + 2, 4].Value = appraisers.ElementAt(i).IdNavigation.Birthday.ToString("MM/dd/yyyy");
                worksheet.Cells[i + 2, 5].Value = appraisers.ElementAt(i).IdNavigation.WorksSince.ToString("yyyy");
                worksheet.Cells[i + 2, 6].Value = appraisers.ElementAt(i).Position;
            }

            // Add to table / Add summary row
            var tbl = worksheet.Tables.Add(new ExcelAddressBase(fromRow: 1, fromCol: 1, toRow: appraisers.Count() + 1, toColumn: 6), "Data");
            tbl.ShowHeader = true;
            tbl.TableStyle = TableStyles.Medium15;

            // AutoFitColumns
            worksheet.Cells[1, 1, appraisers.Count() + 1, 6].AutoFitColumns();
            worksheet.Cells[1, 1, appraisers.Count() + 1, 6].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            return package;
        }
    }
}