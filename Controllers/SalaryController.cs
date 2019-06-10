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
    public class SalaryController : ControllerBase
    {
        private readonly OcenkaManagementContext _context;

        public SalaryController(OcenkaManagementContext context)
        {
            _context = context;
        }

        public static DateTime getLastDay(DateTime date) {
            return new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month));
        }

        // GET: api/Salary/5
        [HttpGet("{month}")]
        public async Task<IActionResult> GetSalary([FromRoute] int month)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            List<SalaryClass> salResult = new List<SalaryClass>();
            IEnumerable<ContractSet> contracts = _context.ContractSet;
            IEnumerable<AppraiserContract> contrAppraiser = _context.AppraiserContract;
            IEnumerable<UserSetAppraiser> appraisers = _context.UserSetAppraiser;
            IEnumerable<UserSet> users = _context.UserSet;
            IEnumerable<SalarySettingsSet> settings = _context.SalarySettingsSet;
            IEnumerable<ObjectSetFlat> flats = _context.ObjectSetFlat;
            IEnumerable<ObjectSetCar> cars = _context.ObjectSetCar;
            IEnumerable<ObjectSetParcel> parcels = _context.ObjectSetParcel;
            SalaryClass sal = new SalaryClass();
            ContractSet cntr = new ContractSet();
            AppraiserContract conApp = new AppraiserContract();
            UserSetAppraiser appr = new UserSetAppraiser();
            UserSet usr = new UserSet();
            ObjectSetFlat flt = new ObjectSetFlat();
            ObjectSetCar car = new ObjectSetCar();
            ObjectSetParcel prc = new ObjectSetParcel();

            DateTime currDate = new DateTime();
            DateTime monthStart = new DateTime();
            DateTime monthFinish = new DateTime();
            currDate = DateTime.Now;

            if (month != 0)
            {
                month = month * (-1);
                currDate = currDate.AddMonths(month);
                monthFinish = getLastDay(currDate);
            } else
            {
                monthFinish = currDate;
            }

            monthStart = new DateTime(currDate.Year, currDate.Month, 1);

            contracts = contracts.Where(cn => DateTime.Compare(cn.FinishDate, monthStart) >= 0 && DateTime.Compare(cn.FinishDate, monthFinish) <= 0);

            for (int i = 0; i < contracts.Count(); i++)
            {
                sal = null;
                conApp = null;
                appr = null;
                usr = null;

                conApp = contrAppraiser.FirstOrDefault(c => c.ContractId == contracts.ElementAt(i).Id);
                appr = appraisers.FirstOrDefault(a => a.Id == conApp.AppraiserId);
                usr = users.FirstOrDefault(u => u.Id == appr.Id);

                flt = flats.FirstOrDefault(u => u.Id == contracts.ElementAt(i).ObjectId);
                car = cars.FirstOrDefault(u => u.Id == contracts.ElementAt(i).ObjectId);
                prc = parcels.FirstOrDefault(u => u.Id == contracts.ElementAt(i).ObjectId);                

                sal = salResult.FirstOrDefault(s => s.Surname == usr.Surname);

                if (sal == null)
                {
                    sal = new SalaryClass();
                    if (flt != null)
                    {
                        sal.ContractsFlat.Add(contracts.ElementAt(i));
                    }
                    else
                    {
                        if (prc != null)
                        {
                            sal.ContractsParcel.Add(contracts.ElementAt(i));
                        }
                        else
                        {
                            sal.ContractsCar.Add(contracts.ElementAt(i));
                        }
                    }
                    sal.Surname = usr.Surname;
                    sal.Name = usr.Name;
                    sal.Patronymic = usr.Patronymic;
                    sal.Month = month;

                    contracts.ElementAt(i).Client = null;
                    contracts.ElementAt(i).AppraiserContract = null;
                    contracts.ElementAt(i).Object = null;

                    salResult.Add(sal);
                } else
                {
                    salResult.Remove(sal);
                    if (flt != null)
                    {
                        contracts.ElementAt(i).Client = null;
                        contracts.ElementAt(i).AppraiserContract = null;
                        contracts.ElementAt(i).Object = null;
                        sal.ContractsFlat.Add(contracts.ElementAt(i));
                    }
                    else
                    {
                        if (prc != null)
                        {
                            contracts.ElementAt(i).Client = null;
                            contracts.ElementAt(i).AppraiserContract = null;
                            contracts.ElementAt(i).Object = null;
                            sal.ContractsParcel.Add(contracts.ElementAt(i));
                        }
                        else
                        {
                            contracts.ElementAt(i).Client = null;
                            contracts.ElementAt(i).AppraiserContract = null;
                            contracts.ElementAt(i).Object = null;
                            sal.ContractsCar.Add(contracts.ElementAt(i));
                        }
                    }
                    salResult.Add(sal);
                }
            }

            for (int i = 0; i < salResult.Count(); i++)
            {
                salResult.ElementAt(i).ContractsCount = salResult.ElementAt(i).ContractsCar.Count + salResult.ElementAt(i).ContractsFlat.Count + salResult.ElementAt(i).ContractsParcel.Count;

                foreach (ContractSet contr in salResult.ElementAt(i).ContractsFlat)
                {
                    salResult.ElementAt(i).Salary += contr.ContractSumm / 100 * settings.First().FlatPercent;
                }

                foreach (ContractSet contr in salResult.ElementAt(i).ContractsCar)
                {
                    salResult.ElementAt(i).Salary += contr.ContractSumm / 100 * settings.First().CarPercent;
                }

                foreach (ContractSet contr in salResult.ElementAt(i).ContractsParcel)
                {
                    salResult.ElementAt(i).Salary += contr.ContractSumm / 100 * settings.First().ParcelPercent;
                }

                salResult.ElementAt(i).Salary = Math.Round(salResult.ElementAt(i).Salary, MidpointRounding.ToEven);
            }

            if (salResult == null)
            {
                return NotFound();
            }

            return Ok(salResult);
        }

        [HttpPost("ToExcel/{month}")]
        public async Task<IActionResult> ToExcel([FromRoute] int month)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            List<SalaryClass> salResult = new List<SalaryClass>();
            IEnumerable<ContractSet> contracts = _context.ContractSet;
            IEnumerable<AppraiserContract> contrAppraiser = _context.AppraiserContract;
            IEnumerable<UserSetAppraiser> appraisers = _context.UserSetAppraiser;
            IEnumerable<UserSet> users = _context.UserSet;
            IEnumerable<SalarySettingsSet> settings = _context.SalarySettingsSet;
            IEnumerable<ObjectSetFlat> flats = _context.ObjectSetFlat;
            IEnumerable<ObjectSetCar> cars = _context.ObjectSetCar;
            IEnumerable<ObjectSetParcel> parcels = _context.ObjectSetParcel;
            SalaryClass sal = new SalaryClass();
            ContractSet cntr = new ContractSet();
            AppraiserContract conApp = new AppraiserContract();
            UserSetAppraiser appr = new UserSetAppraiser();
            UserSet usr = new UserSet();
            ObjectSetFlat flt = new ObjectSetFlat();
            ObjectSetCar car = new ObjectSetCar();
            ObjectSetParcel prc = new ObjectSetParcel();

            DateTime currDate = new DateTime();
            DateTime monthStart = new DateTime();
            DateTime monthFinish = new DateTime();
            currDate = DateTime.Now;

            if (month != 0)
            {
                month = month * (-1);
                currDate = currDate.AddMonths(month);
                monthFinish = getLastDay(currDate);
            }
            else
            {
                monthFinish = currDate;
            }

            monthStart = new DateTime(currDate.Year, currDate.Month, 1);

            contracts = contracts.Where(cn => DateTime.Compare(cn.FinishDate, monthStart) >= 0 && DateTime.Compare(cn.FinishDate, monthFinish) <= 0);

            for (int i = 0; i < contracts.Count(); i++)
            {
                sal = null;
                conApp = null;
                appr = null;
                usr = null;

                conApp = contrAppraiser.FirstOrDefault(c => c.ContractId == contracts.ElementAt(i).Id);
                appr = appraisers.FirstOrDefault(a => a.Id == conApp.AppraiserId);
                usr = users.FirstOrDefault(u => u.Id == appr.Id);

                flt = flats.FirstOrDefault(u => u.Id == contracts.ElementAt(i).ObjectId);
                car = cars.FirstOrDefault(u => u.Id == contracts.ElementAt(i).ObjectId);
                prc = parcels.FirstOrDefault(u => u.Id == contracts.ElementAt(i).ObjectId);

                sal = salResult.FirstOrDefault(s => s.Surname == usr.Surname);

                if (sal == null)
                {
                    sal = new SalaryClass();
                    if (flt != null)
                    {
                        sal.ContractsFlat.Add(contracts.ElementAt(i));
                    }
                    else
                    {
                        if (prc != null)
                        {
                            sal.ContractsParcel.Add(contracts.ElementAt(i));
                        }
                        else
                        {
                            sal.ContractsCar.Add(contracts.ElementAt(i));
                        }
                    }
                    sal.Surname = usr.Surname;
                    sal.Name = usr.Name;
                    sal.Patronymic = usr.Patronymic;
                    sal.Month = month;

                    contracts.ElementAt(i).Client = null;
                    contracts.ElementAt(i).AppraiserContract = null;
                    contracts.ElementAt(i).Object = null;

                    salResult.Add(sal);
                }
                else
                {
                    salResult.Remove(sal);
                    if (flt != null)
                    {
                        contracts.ElementAt(i).Client = null;
                        contracts.ElementAt(i).AppraiserContract = null;
                        contracts.ElementAt(i).Object = null;
                        sal.ContractsFlat.Add(contracts.ElementAt(i));
                    }
                    else
                    {
                        if (prc != null)
                        {
                            contracts.ElementAt(i).Client = null;
                            contracts.ElementAt(i).AppraiserContract = null;
                            contracts.ElementAt(i).Object = null;
                            sal.ContractsParcel.Add(contracts.ElementAt(i));
                        }
                        else
                        {
                            contracts.ElementAt(i).Client = null;
                            contracts.ElementAt(i).AppraiserContract = null;
                            contracts.ElementAt(i).Object = null;
                            sal.ContractsCar.Add(contracts.ElementAt(i));
                        }
                    }
                    salResult.Add(sal);
                }
            }

            for (int i = 0; i < salResult.Count(); i++)
            {
                salResult.ElementAt(i).ContractsCount = salResult.ElementAt(i).ContractsCar.Count + salResult.ElementAt(i).ContractsFlat.Count + salResult.ElementAt(i).ContractsParcel.Count;

                foreach (ContractSet contr in salResult.ElementAt(i).ContractsFlat)
                {
                    salResult.ElementAt(i).Salary += contr.ContractSumm / 100 * settings.First().FlatPercent;
                }

                foreach (ContractSet contr in salResult.ElementAt(i).ContractsCar)
                {
                    salResult.ElementAt(i).Salary += contr.ContractSumm / 100 * settings.First().CarPercent;
                }

                foreach (ContractSet contr in salResult.ElementAt(i).ContractsParcel)
                {
                    salResult.ElementAt(i).Salary += contr.ContractSumm / 100 * settings.First().ParcelPercent;
                }
            }

            string[] monthArr = new string[] { "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" };

            var fileDownloadName = "Зарплата - " + monthArr[monthStart.Month - 1] + ".xlsx";

            using (var package = createExcelPackage(salResult))
            {
                package.SaveAs(new FileInfo(Path.Combine(@"C:\Users\user\Downloads", fileDownloadName)));
            }
            return Ok();
        }

        private ExcelPackage createExcelPackage(List<SalaryClass> salary)
        {
            var package = new ExcelPackage();
            package.Workbook.Properties.Title = "Отчёт - зарплата";
            package.Workbook.Properties.Author = "Ocenka Management";
            package.Workbook.Properties.Subject = "Отчёт - зарплата";
            package.Workbook.Properties.Keywords = "Ocenka Management";


            var worksheet = package.Workbook.Worksheets.Add("Зарплата");

            //First add the headers
            worksheet.Cells[1, 1].Value = "ФИО";
            worksheet.Cells[1, 2].Value = "Оклад";
            worksheet.Cells[1, 3].Value = "Уральск. Коэф. (15%)";
            worksheet.Cells[1, 4].Value = "НДФЛ (13%)";
            worksheet.Cells[1, 5].Value = "Получено";
            worksheet.Cells[1, 6].Value = "Аванс (40%)";
            worksheet.Cells[1, 7].Value = "К выплате";

            //Add values

            double koeff, ndfl, res, prepaid, itog;

            for (int i = 0; i < salary.Count(); i++)
            {
                koeff = salary.ElementAt(i).Salary * 0.15;
                ndfl = salary.ElementAt(i).Salary * 0.13;
                res = salary.ElementAt(i).Salary + koeff - ndfl;
                prepaid = res * 0.4;
                itog = res - prepaid;

                worksheet.Cells[i + 2, 1].Value = getFio(salary.ElementAt(i).Surname, salary.ElementAt(i).Name, salary.ElementAt(i).Patronymic);
                worksheet.Cells[i + 2, 2].Value = Math.Round(salary.ElementAt(i).Salary, MidpointRounding.ToEven);
                worksheet.Cells[i + 2, 3].Value = Math.Round(koeff, MidpointRounding.ToEven);
                worksheet.Cells[i + 2, 4].Value = Math.Round(ndfl, MidpointRounding.ToEven);
                worksheet.Cells[i + 2, 5].Value = Math.Round(res, MidpointRounding.ToEven);
                worksheet.Cells[i + 2, 6].Value = Math.Round(prepaid, MidpointRounding.ToEven);
                worksheet.Cells[i + 2, 7].Value = Math.Round(itog, MidpointRounding.ToEven);
            }

            // Add to table / Add summary row
            var tbl = worksheet.Tables.Add(new ExcelAddressBase(fromRow: 1, fromCol: 1, toRow: salary.Count() + 1, toColumn: 7), "Data");
            tbl.ShowHeader = true;
            tbl.TableStyle = TableStyles.Medium15;

            // AutoFitColumns
            worksheet.Cells[1, 1, salary.Count() + 1, 7].AutoFitColumns();
            worksheet.Cells[1, 1, salary.Count() + 1, 7].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            return package;
        }

        private string getFio(string surname, string name, string patronymic)
        {
            string res = "";

            res = surname + " " + name.Substring(0, 1).ToUpper() + ". " + patronymic.Substring(0, 1).ToUpper() + ".";

            return res;
        }
    }
}