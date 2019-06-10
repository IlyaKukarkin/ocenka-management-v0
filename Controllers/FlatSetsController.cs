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
    public class FlatSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public FlatSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/FlatSets
        [HttpGet]
        public IEnumerable<ObjectSetFlat> GetObjectSetFlat()
        {
            IEnumerable<ObjectSetFlat> flats = _context.ObjectSetFlat;
            IEnumerable<ObjectSet> objects = _context.ObjectSet;
            IEnumerable<AddressSet> adresses = _context.AddressSet;
            ObjectSetFlat flt = new ObjectSetFlat();
            AddressSet adr = new AddressSet();
            ObjectSet obj = new ObjectSet();

            for (int i = 0; i < flats.Count(); i++)
            {
                adr = adresses.FirstOrDefault(u => u.Id == flats.ElementAt(i).AddressId);
                adr.ObjectSetFlat = null;
                flats.ElementAt(i).Address = adr;

                obj = objects.FirstOrDefault(u => u.Id == flats.ElementAt(i).Id);
                obj.ObjectSetFlat = null;
                flats.ElementAt(i).IdNavigation = obj;
            }

            return flats;
        }

        // GET: api/FlatSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetObjectSetFlat([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSetFlat = await _context.ObjectSetFlat.FindAsync(id);

            if (objectSetFlat == null)
            {
                return NotFound();
            }

            return Ok(objectSetFlat);
        }

        // PUT: api/FlatSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutObjectSetFlat([FromRoute] int id, [FromBody] ObjectSetFlat objectSetFlat)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objectSetFlat.Id)
            {
                return BadRequest();
            }

            _context.Entry(objectSetFlat).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObjectSetFlatExists(id))
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

        // POST: api/FlatSets
        [HttpPost]
        public async Task<IActionResult> PostObjectSetFlat([FromBody] ObjectSetFlat objectSetFlat)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ObjectSetFlat.Add(objectSetFlat);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ObjectSetFlatExists(objectSetFlat.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetObjectSetFlat", new { id = objectSetFlat.Id }, objectSetFlat);
        }

        // DELETE: api/FlatSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteObjectSetFlat([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSetFlat = await _context.ObjectSetFlat.FindAsync(id);
            if (objectSetFlat == null)
            {
                return NotFound();
            }

            _context.ObjectSetFlat.Remove(objectSetFlat);
            await _context.SaveChangesAsync();

            return Ok(objectSetFlat);
        }

        private bool ObjectSetFlatExists(int id)
        {
            return _context.ObjectSetFlat.Any(e => e.Id == id);
        }

        [HttpPost("ToExcel")]
        public async Task<IActionResult> ToExcel([FromBody] Excel excel)
        {
            IEnumerable<ObjectSetFlat> flats = _context.ObjectSetFlat;
            IEnumerable<AddressSet> addresses = _context.AddressSet;
            IEnumerable<ObjectSet> objects = _context.ObjectSet;
            List<ObjectSetFlat> flatsRes = new List<ObjectSetFlat>();
            ObjectSetFlat flt = new ObjectSetFlat();
            ObjectSet obj = new ObjectSet();
            AddressSet adr = new AddressSet();

            for (int i = 0; i < excel.Ids.Count(); i++)
            {
                flt = flats.FirstOrDefault(u => u.Id == excel.Ids[i]);

                adr = addresses.FirstOrDefault(u => u.Id == flt.AddressId);
                adr.ObjectSetFlat = null;
                flt.Address = adr;

                obj = objects.FirstOrDefault(u => u.Id == flt.Id);
                obj.ObjectSetFlat = null;
                flt.IdNavigation = obj;

                flatsRes.Add(flt);
            }

            var fileDownloadName = "Квартиры.xlsx";

            using (var package = createExcelPackage(flatsRes))
            {
                package.SaveAs(new FileInfo(Path.Combine(@"C:\Users\user\Downloads", fileDownloadName)));
            }
            return Ok();
        }

        private ExcelPackage createExcelPackage(IEnumerable<ObjectSetFlat> flats)
        {
            var package = new ExcelPackage();
            package.Workbook.Properties.Title = "Отчёт - квартиры";
            package.Workbook.Properties.Author = "Ocenka Management";
            package.Workbook.Properties.Subject = "Отчёт - квартиры";
            package.Workbook.Properties.Keywords = "Ocenka Management";


            var worksheet = package.Workbook.Worksheets.Add("Квартиры");

            //First add the headers
            worksheet.Cells[1, 1].Value = "Кадастровый номер";
            worksheet.Cells[1, 2].Value = "Цель оценки";
            worksheet.Cells[1, 3].Value = "Площадь";
            worksheet.Cells[1, 4].Value = "Кол-во комнат";
            worksheet.Cells[1, 5].Value = "Этаж";
            worksheet.Cells[1, 6].Value = "Город";
            worksheet.Cells[1, 7].Value = "Район";
            worksheet.Cells[1, 8].Value = "Улица";
            worksheet.Cells[1, 9].Value = "Дом";
            worksheet.Cells[1, 10].Value = "Квартира";

            //Add values

            for (int i = 0; i < flats.Count(); i++)
            {
                worksheet.Cells[i + 2, 1].Value = flats.ElementAt(i).IdNavigation.CadastralNumber.ToString("##:##:#######:##");
                worksheet.Cells[i + 2, 2].Value = flats.ElementAt(i).IdNavigation.AimOfEvaluation;
                worksheet.Cells[i + 2, 3].Value = flats.ElementAt(i).Area;
                worksheet.Cells[i + 2, 4].Value = flats.ElementAt(i).NumberOfRooms;
                worksheet.Cells[i + 2, 5].Value = flats.ElementAt(i).Floor;
                worksheet.Cells[i + 2, 6].Value = flats.ElementAt(i).Address.City;
                worksheet.Cells[i + 2, 7].Value = flats.ElementAt(i).Address.District;
                worksheet.Cells[i + 2, 8].Value = flats.ElementAt(i).Address.Street;
                worksheet.Cells[i + 2, 9].Value = flats.ElementAt(i).Address.House;
                worksheet.Cells[i + 2, 10].Value = flats.ElementAt(i).Address.NumberOfFlat;
            }

            // Add to table / Add summary row
            var tbl = worksheet.Tables.Add(new ExcelAddressBase(fromRow: 1, fromCol: 1, toRow: flats.Count() + 1, toColumn: 10), "Data");
            tbl.ShowHeader = true;
            tbl.TableStyle = TableStyles.Medium15;

            // AutoFitColumns
            worksheet.Cells[1, 1, flats.Count() + 1, 10].AutoFitColumns();
            worksheet.Cells[1, 1, flats.Count() + 1, 10].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            return package;
        }
    }
}