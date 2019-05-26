using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ocenka_management.Models;

namespace ocenka_management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NeuralController : ControllerBase
    {
        // POST: api/Neural
        [HttpPost]
        public double PostNeural([FromBody] Neural neural)
        {
            double result = 0;

            //Some validations

            //Calculations

            return result;
        }
    }

    public class Neural
    {
        public double RefinancingRate { get; set; }
        public double AverageSalary { get; set; }
        public double Gdp { get; set; }
        public double Rts { get; set; }
        public double DollarPrice { get; set; }
        public double BrentPrice { get; set; }
        public double EstateBuilding { get; set; }
        public double CreditsAmount { get; set; }
        public double LivingArea { get; set; }
        public double KitchenArea { get; set; }
        public int NumberOfRooms { get; set; }
        public int Floor { get; set; }
        public int NumberOfFloors { get; set; }
        public int District { get; set; }
        public int Year { get; set; }
        public int Walls { get; set; }
    }
}