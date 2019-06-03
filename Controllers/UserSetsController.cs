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
    public class UserSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public UserSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/UserSets
        [HttpGet]
        public IEnumerable<UserSet> GetUserSet()
        {
            return _context.UserSet;
        }

        // GET: api/UserSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSet = await _context.UserSet.FindAsync(id);

            if (userSet == null)
            {
                return NotFound();
            }

            return Ok(userSet);
        }

        // PUT: api/UserSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserSet([FromRoute] int id, [FromBody] UserSet userSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userSet.Id)
            {
                return BadRequest();
            }

            _context.Entry(userSet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSetExists(id))
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

        // POST: api/UserSets
        [HttpPost]
        public async Task<IActionResult> PostUserSet([FromBody] UserSet userSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.UserSet.Add(userSet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserSet", new { id = userSet.Id }, userSet);
        }

        // DELETE: api/UserSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userSet = await _context.UserSet.FindAsync(id);
            if (userSet == null)
            {
                return NotFound();
            } else
            {
                if (userSet.RoleId == 3)
                    return NotFound();
            }

            _context.UserSet.Remove(userSet);
            await _context.SaveChangesAsync();

            return Ok(userSet);
        }

        private bool UserSetExists(int id)
        {
            return _context.UserSet.Any(e => e.Id == id);
        }

        [HttpPost("ToExcel")]
        public async Task<IActionResult> ToExcel([FromBody] Excel excel)
        {
            IEnumerable<UserSet> users = _context.UserSet;
            List<UserSet> usersRes = new List<UserSet>();
            UserSet usr = new UserSet();

            for (int i = 0; i < excel.Ids.Count(); i++)
            {
                usr = users.First(u => u.Id == excel.Ids[i]);
                usersRes.Add(usr);
            }

            var fileDownloadName = "Пользователи.xlsx";

            using (var package = createExcelPackage(usersRes))
            {
                package.SaveAs(new FileInfo(Path.Combine(@"C:\Users\user\Downloads", fileDownloadName)));
            }
            return Ok();
        }

        private ExcelPackage createExcelPackage(IEnumerable<UserSet> users)
        {
            var package = new ExcelPackage();
            package.Workbook.Properties.Title = "Отчёт - пользователи";
            package.Workbook.Properties.Author = "Ocenka Management";
            package.Workbook.Properties.Subject = "Отчёт - пользователи";
            package.Workbook.Properties.Keywords = "Ocenka Management";


            var worksheet = package.Workbook.Worksheets.Add("Пользователи");

            //First add the headers
            worksheet.Cells[1, 1].Value = "Фамилия";
            worksheet.Cells[1, 2].Value = "Имя";
            worksheet.Cells[1, 3].Value = "Отчество";
            worksheet.Cells[1, 4].Value = "День рождения";
            worksheet.Cells[1, 5].Value = "Работает с";
            worksheet.Cells[1, 6].Value = "Должность";

            //Add values

            for (int i = 0; i < users.Count(); i++)
            {
                worksheet.Cells[i + 2, 1].Value = users.ElementAt(i).Surname;
                worksheet.Cells[i + 2, 2].Value = users.ElementAt(i).Name;
                worksheet.Cells[i + 2, 3].Value = users.ElementAt(i).Patronymic;
                worksheet.Cells[i + 2, 4].Value = users.ElementAt(i).Birthday.ToString("MM/dd/yyyy");
                worksheet.Cells[i + 2, 5].Value = users.ElementAt(i).WorksSince.ToString("yyyy");
                switch (users.ElementAt(i).RoleId)
                {
                    case 1:
                        worksheet.Cells[i + 2, 6].Value = "Оценщик";
                        break;
                    case 2:
                        worksheet.Cells[i + 2, 6].Value = "Бухгалтер";
                        break;
                    case 3:
                        worksheet.Cells[i + 2, 6].Value = "Директор";
                        break;
                }
            }

            // Add to table / Add summary row
            var tbl = worksheet.Tables.Add(new ExcelAddressBase(fromRow: 1, fromCol: 1, toRow: users.Count() + 1, toColumn: 6), "Data");
            tbl.ShowHeader = true;
            tbl.TableStyle = TableStyles.Dark9;

            // AutoFitColumns
            worksheet.Cells[1, 1, users.Count() + 1, 6].AutoFitColumns();
            worksheet.Cells[1, 1, users.Count() + 1, 6].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            return package;
        }
    }
}