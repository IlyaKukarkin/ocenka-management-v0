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
    public class ParcelSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public ParcelSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/ParcelSets
        [HttpGet]
        public IEnumerable<ObjectSetParcel> GetObjectSetParcel()
        {
            IEnumerable<ObjectSetParcel> parcels = _context.ObjectSetParcel;
            IEnumerable<ObjectSet> objects = _context.ObjectSet;
            ObjectSetParcel prc = new ObjectSetParcel();
            ObjectSet obj = new ObjectSet();

            for (int i = 0; i < parcels.Count(); i++)
            {
                obj = objects.FirstOrDefault(u => u.Id == parcels.ElementAt(i).Id);
                obj.ObjectSetParcel = null;
                parcels.ElementAt(i).IdNavigation = obj;
            }

            return parcels;
        }

        // GET: api/ParcelSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetObjectSetParcel([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSetParcel = await _context.ObjectSetParcel.FindAsync(id);

            if (objectSetParcel == null)
            {
                return NotFound();
            }

            return Ok(objectSetParcel);
        }

        // PUT: api/ParcelSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutObjectSetParcel([FromRoute] int id, [FromBody] ObjectSetParcel objectSetParcel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objectSetParcel.Id)
            {
                return BadRequest();
            }

            _context.Entry(objectSetParcel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObjectSetParcelExists(id))
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

        // POST: api/ParcelSets
        [HttpPost]
        public async Task<IActionResult> PostObjectSetParcel([FromBody] ObjectSetParcel objectSetParcel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ObjectSetParcel.Add(objectSetParcel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ObjectSetParcelExists(objectSetParcel.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetObjectSetParcel", new { id = objectSetParcel.Id }, objectSetParcel);
        }

        // DELETE: api/ParcelSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteObjectSetParcel([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSetParcel = await _context.ObjectSetParcel.FindAsync(id);
            if (objectSetParcel == null)
            {
                return NotFound();
            }

            _context.ObjectSetParcel.Remove(objectSetParcel);
            await _context.SaveChangesAsync();

            return Ok(objectSetParcel);
        }

        private bool ObjectSetParcelExists(int id)
        {
            return _context.ObjectSetParcel.Any(e => e.Id == id);
        }

        [HttpPost("ToExcel")]
        public async Task<IActionResult> ToExcel([FromBody] Excel excel)
        {
            IEnumerable<ObjectSetParcel> parcels = _context.ObjectSetParcel;
            IEnumerable<ObjectSet> objects = _context.ObjectSet;
            List<ObjectSetParcel> parcelsRes = new List<ObjectSetParcel>();
            ObjectSetParcel prcl = new ObjectSetParcel();
            ObjectSet obj = new ObjectSet();

            for (int i = 0; i < excel.Ids.Count(); i++)
            {
                prcl = parcels.FirstOrDefault(u => u.Id == excel.Ids[i]);

                obj = objects.FirstOrDefault(u => u.Id == prcl.Id);
                obj.ObjectSetParcel = null;
                prcl.IdNavigation = obj;

                parcelsRes.Add(prcl);
            }

            var fileDownloadName = "Участки.xlsx";

            using (var package = createExcelPackage(parcelsRes))
            {
                package.SaveAs(new FileInfo(Path.Combine(@"C:\Users\user\Downloads", fileDownloadName)));
            }
            return Ok();
        }

        private ExcelPackage createExcelPackage(IEnumerable<ObjectSetParcel> parcels)
        {
            var package = new ExcelPackage();
            package.Workbook.Properties.Title = "Отчёт - участки";
            package.Workbook.Properties.Author = "Ocenka Management";
            package.Workbook.Properties.Subject = "Отчёт - участки";
            package.Workbook.Properties.Keywords = "Ocenka Management";


            var worksheet = package.Workbook.Worksheets.Add("Участки");

            //First add the headers
            worksheet.Cells[1, 1].Value = "Кадастровый номер";
            worksheet.Cells[1, 2].Value = "Цель оценки";
            worksheet.Cells[1, 3].Value = "Площадь";
            worksheet.Cells[1, 4].Value = "Тип использования";

            //Add values

            for (int i = 0; i < parcels.Count(); i++)
            {
                worksheet.Cells[i + 2, 1].Value = parcels.ElementAt(i).IdNavigation.CadastralNumber.ToString("##:##:#######:##");
                worksheet.Cells[i + 2, 2].Value = parcels.ElementAt(i).IdNavigation.AimOfEvaluation;
                worksheet.Cells[i + 2, 3].Value = parcels.ElementAt(i).Area;
                worksheet.Cells[i + 2, 4].Value = parcels.ElementAt(i).UsageType;
            }

            // Add to table / Add summary row
            var tbl = worksheet.Tables.Add(new ExcelAddressBase(fromRow: 1, fromCol: 1, toRow: parcels.Count() + 1, toColumn: 4), "Data");
            tbl.ShowHeader = true;
            tbl.TableStyle = TableStyles.Dark9;

            // AutoFitColumns
            worksheet.Cells[1, 1, parcels.Count() + 1, 4].AutoFitColumns();
            worksheet.Cells[1, 1, parcels.Count() + 1, 4].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            return package;
        }
    }
}