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

            IEnumerable<AppraiserContract> aprContr = _context.AppraiserContract;
            AppraiserContract apr = new AppraiserContract();

            for (int i = 0; i < aprContr.Count(); i++)
            {
                if (aprContr.ElementAt(i).ContractId == id)
                {
                    apr = aprContr.ElementAt(i);
                    break;
                }
            }

            var contractSet = await _context.ContractSet.FindAsync(id);
            if (contractSet == null)
            {
                return NotFound();
            }

            _context.AppraiserContract.Remove(apr);
            _context.ContractSet.Remove(contractSet);
            await _context.SaveChangesAsync();

            return Ok(contractSet);
        }

        private bool ContractSetExists(int id)
        {
            return _context.ContractSet.Any(e => e.Id == id);
        }

        [HttpPost("ToExcel")]
        public async Task<IActionResult> ToExcel([FromBody] Excel excel)
        {
            List<ContractSet> contractsRes = new List<ContractSet>();
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

            for (int i = 0; i < excel.Ids.Count(); i++)
            {
                cntr = contracts.FirstOrDefault(u => u.Id == excel.Ids[i]);

                clnt = clients.FirstOrDefault(u => u.Id == cntr.ClientId);
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
                }
                else
                {
                    ent.IdNavigation = null;
                    adr = addresses.FirstOrDefault(u => u.Id == ent.LegalAddressId);
                    adr.ClientSetEntity = null;
                    ent.LegalAddress = adr;
                    clnt.ClientSetEntity = ent;
                }
                cntr.Client = clnt;

                obj = objects.FirstOrDefault(u => u.Id == cntr.ObjectId);
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
                cntr.Object = obj;

                aprCntr = apraisersContract.FirstOrDefault(u => u.ContractId == cntr.Id);
                apr = apraisers.FirstOrDefault(u => u.Id == aprCntr.AppraiserId);
                apr.AppraiserContract = null;
                usr = users.FirstOrDefault(u => u.Id == apr.Id);
                usr.UserSetAppraiser = null;
                apr.IdNavigation = usr;
                aprCntr.Appraiser = apr;
                aprCntr.Contract = null;

                AppraiserContract[] arr = new AppraiserContract[1];
                arr[0] = aprCntr;
                cntr.AppraiserContract = arr;

                contractsRes.Add(cntr);
            }

            var fileDownloadName = "Договоры.xlsx";

            using (var package = createExcelPackage(contractsRes))
            {
                package.SaveAs(new FileInfo(Path.Combine(@"C:\Users\user\Downloads", fileDownloadName)));
            }
            return Ok();
        }

        private ExcelPackage createExcelPackage(IEnumerable<ContractSet> contracts)
        {
            var package = new ExcelPackage();
            package.Workbook.Properties.Title = "Отчёт - договоры";
            package.Workbook.Properties.Author = "Ocenka Management";
            package.Workbook.Properties.Subject = "Отчёт - договоры";
            package.Workbook.Properties.Keywords = "Ocenka Management";


            var worksheet = package.Workbook.Worksheets.Add("Договоры");

            //First add the headers
            worksheet.Cells[1, 1].Value = "Сумма договора";
            worksheet.Cells[1, 2].Value = "Аванс";
            worksheet.Cells[1, 3].Value = "Дата начала";
            worksheet.Cells[1, 4].Value = "Дата окончания";
            worksheet.Cells[1, 5].Value = "Оценщик";
            worksheet.Cells[1, 6].Value = "Клиент";
            worksheet.Cells[1, 7].Value = "Объект оценки";
            worksheet.Cells[1, 8].Value = "Кадастровый номер";
            worksheet.Cells[1, 9].Value = "Цель оценки";
            worksheet.Cells[1, 10].Value = "Объект оценки подробно";

            //Add values

            for (int i = 0; i < contracts.Count(); i++)
            {
                worksheet.Cells[i + 2, 1].Value = contracts.ElementAt(i).ContractSumm;
                worksheet.Cells[i + 2, 2].Value = contracts.ElementAt(i).Prepaid;
                worksheet.Cells[i + 2, 3].Value = contracts.ElementAt(i).StartDate.ToString("MM/dd/yyyy");
                worksheet.Cells[i + 2, 4].Value = contracts.ElementAt(i).FinishDate.ToString("MM/dd/yyyy");
                worksheet.Cells[i + 2, 5].Value = getApprFio(contracts.ElementAt(i).AppraiserContract.First().Appraiser);
                if (contracts.ElementAt(i).Client.ClientSetIndividual != null) {
                    worksheet.Cells[i + 2, 6].Value = getClientFio(contracts.ElementAt(i).Client.ClientSetIndividual);
                } else
                {
                    worksheet.Cells[i + 2, 6].Value = contracts.ElementAt(i).Client.ClientSetEntity.CompanyName;
                }

                if (contracts.ElementAt(i).Object.CadastralNumber == 0)
                {
                    worksheet.Cells[i + 2, 8].Value = "Нет";
                } else
                {
                    worksheet.Cells[i + 2, 8].Value = cadastralToString(contracts.ElementAt(i).Object.CadastralNumber);
                }
                worksheet.Cells[i + 2, 9].Value = contracts.ElementAt(i).Object.AimOfEvaluation;

                if (contracts.ElementAt(i).Object.ObjectSetFlat != null)
                {
                    worksheet.Cells[i + 2, 7].Value = "Квартира";                    
                    worksheet.Cells[i + 2, 10].Value = flatToString(contracts.ElementAt(i).Object.ObjectSetFlat);
                }
                else
                {
                    if (contracts.ElementAt(i).Object.ObjectSetCar != null)
                    {
                        worksheet.Cells[i + 2, 7].Value = "Автомобиль";
                        worksheet.Cells[i + 2, 10].Value = carToString(contracts.ElementAt(i).Object.ObjectSetCar);
                    }
                    else
                    {
                        worksheet.Cells[i + 2, 7].Value = "Участок";
                        worksheet.Cells[i + 2, 10].Value = parecelToString(contracts.ElementAt(i).Object.ObjectSetParcel);
                    }
                }
            }

            // Add to table / Add summary row
            var tbl = worksheet.Tables.Add(new ExcelAddressBase(fromRow: 1, fromCol: 1, toRow: contracts.Count() + 1, toColumn: 10), "Data");
            tbl.ShowHeader = true;
            tbl.TableStyle = TableStyles.Dark9;

            // AutoFitColumns
            worksheet.Cells[1, 1, contracts.Count() + 1, 10].AutoFitColumns();
            worksheet.Cells[1, 1, contracts.Count() + 1, 10].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            return package;
        }

        private string getApprFio(UserSetAppraiser apr)
        {
            string res = "";

            res = apr.IdNavigation.Surname + " " + apr.IdNavigation.Name.Substring(0, 1).ToUpper() + ". " + apr.IdNavigation.Patronymic.Substring(0, 1).ToUpper() + ".";

            return res;
        }

        private string getClientFio(ClientSetIndividual clnt)
        {
            string res = "";

            res = clnt.Surname + " " + clnt.Name.Substring(0, 1).ToUpper() + ". " + clnt.Patronymic.Substring(0, 1).ToUpper() + ".";

            return res;
        }

        private string getAddress(AddressSet adr)
        {
            string res = "";

            res = adr.Street + ", " + adr.House;

            return res;
        }

        private string flatToString(ObjectSetFlat flt)
        {
            string res = "";

            res = "Площадь: " + flt.Area + ", Кол-во комнат: " + flt.NumberOfRooms + ", Этаж: " + flt.Floor + ", Адрес: " + getAddress(flt.Address);

            return res;
        }

        private string carToString(ObjectSetCar car)
        {
            string res = "";

            res = "Марка: " + car.Mark + ", Модель: " + car.Model + ", Рег. номер: " + car.LicenseNumber + ", Год выпуска: " + car.Year;

            return res;
        }

        private string parecelToString(ObjectSetParcel parcel)
        {
            string res = "";

            res = "Площадь: " + parcel.Area + ", Тип использования: " + parcel.UsageType;

            return res;
        }

        private string cadastralToString(long cadast)
        {
            string res = "";
            string cd = cadast.ToString();

            res = cd.Substring(0, 2) + ":" + cd.Substring(2, 2) + ":" + cd.Substring(4, 7) + ":" + cd.Substring(11, 2);

            return res;
        }
    }
}