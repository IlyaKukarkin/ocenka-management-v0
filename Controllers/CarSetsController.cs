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
    public class CarSetsController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public CarSetsController(OcenkaManagementContext context)
        {
            _context = context;
        }

        // GET: api/CarSets
        [HttpGet]
        public IEnumerable<ObjectSetCar> GetObjectSetCar()
        {
            IEnumerable<ObjectSetCar> cars = _context.ObjectSetCar;
            IEnumerable<ObjectSet> objects = _context.ObjectSet;
            ObjectSetCar car = new ObjectSetCar();
            ObjectSet obj = new ObjectSet();

            for (int i = 0; i < cars.Count(); i++)
            {
                obj = objects.FirstOrDefault(u => u.Id == cars.ElementAt(i).Id);
                obj.ObjectSetCar = null;
                cars.ElementAt(i).IdNavigation = obj;
            }

            return cars;
        }

        // GET: api/CarSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetObjectSetCar([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSetCar = await _context.ObjectSetCar.FindAsync(id);

            if (objectSetCar == null)
            {
                return NotFound();
            }

            return Ok(objectSetCar);
        }

        // PUT: api/CarSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutObjectSetCar([FromRoute] int id, [FromBody] ObjectSetCar objectSetCar)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objectSetCar.Id)
            {
                return BadRequest();
            }

            _context.Entry(objectSetCar).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObjectSetCarExists(id))
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

        // POST: api/CarSets
        [HttpPost]
        public async Task<IActionResult> PostObjectSetCar([FromBody] ObjectSetCar objectSetCar)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ObjectSetCar.Add(objectSetCar);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ObjectSetCarExists(objectSetCar.Id))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetObjectSetCar", new { id = objectSetCar.Id }, objectSetCar);
        }

        // DELETE: api/CarSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteObjectSetCar([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objectSetCar = await _context.ObjectSetCar.FindAsync(id);
            if (objectSetCar == null)
            {
                return NotFound();
            }

            _context.ObjectSetCar.Remove(objectSetCar);
            await _context.SaveChangesAsync();

            return Ok(objectSetCar);
        }

        private bool ObjectSetCarExists(int id)
        {
            return _context.ObjectSetCar.Any(e => e.Id == id);
        }

        [HttpPost("ToExcel")]
        public async Task<IActionResult> ToExcel([FromBody] Excel excel)
        {
            IEnumerable<ObjectSetCar> cars = _context.ObjectSetCar;
            IEnumerable<ObjectSet> objects = _context.ObjectSet;
            List<ObjectSetCar> carsRes = new List<ObjectSetCar>();
            ObjectSetCar car = new ObjectSetCar();
            ObjectSet obj = new ObjectSet();

            for (int i = 0; i < excel.Ids.Count(); i++)
            {
                car = cars.FirstOrDefault(u => u.Id == excel.Ids[i]);

                obj = objects.FirstOrDefault(u => u.Id == car.Id);
                obj.ObjectSetCar = null;
                car.IdNavigation = obj;

                carsRes.Add(car);
            }

            var fileDownloadName = "Автомобили.xlsx";

            using (var package = createExcelPackage(carsRes))
            {
                package.SaveAs(new FileInfo(Path.Combine(@"C:\Users\user\Downloads", fileDownloadName)));
            }
            return Ok();
        }

        private ExcelPackage createExcelPackage(IEnumerable<ObjectSetCar> cars)
        {
            var package = new ExcelPackage();
            package.Workbook.Properties.Title = "Отчёт - автомобили";
            package.Workbook.Properties.Author = "Ocenka Management";
            package.Workbook.Properties.Subject = "Отчёт - автомобили";
            package.Workbook.Properties.Keywords = "Ocenka Management";


            var worksheet = package.Workbook.Worksheets.Add("Автомобили");

            //First add the headers
            worksheet.Cells[1, 1].Value = "Марка";
            worksheet.Cells[1, 2].Value = "Модель";
            worksheet.Cells[1, 3].Value = "Регистрационный знак";
            worksheet.Cells[1, 4].Value = "Год выпуска";
            worksheet.Cells[1, 5].Value = "Цель оценки";

            //Add values

            for (int i = 0; i < cars.Count(); i++)
            {
                worksheet.Cells[i + 2, 1].Value = cars.ElementAt(i).Mark;
                worksheet.Cells[i + 2, 2].Value = cars.ElementAt(i).Model;
                worksheet.Cells[i + 2, 3].Value = cars.ElementAt(i).LicenseNumber;
                worksheet.Cells[i + 2, 4].Value = cars.ElementAt(i).Year;
                worksheet.Cells[i + 2, 5].Value = cars.ElementAt(i).IdNavigation.AimOfEvaluation;
            }

            // Add to table / Add summary row
            var tbl = worksheet.Tables.Add(new ExcelAddressBase(fromRow: 1, fromCol: 1, toRow: cars.Count() + 1, toColumn: 5), "Data");
            tbl.ShowHeader = true;
            tbl.TableStyle = TableStyles.Medium15;

            // AutoFitColumns
            worksheet.Cells[1, 1, cars.Count() + 1, 5].AutoFitColumns();
            worksheet.Cells[1, 1, cars.Count() + 1, 5].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            return package;
        }
    }
}