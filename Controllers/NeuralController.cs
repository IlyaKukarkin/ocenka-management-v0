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

            result = Math.Tanh(0.905940380100201 * (Math.Tanh(0.595809091803746 * (0.017873100983021 * neural.LivingArea - 1.16264521894549) + 0.569546637276707 * (0.042826552462527 * neural.KitchenArea - 1.09850107066381) + 0.289064767416814 * (0.5 * neural.NumberOfRooms - 1.5) + 0.048935102658053 * (0.083333333333333 * neural.Floor - 1.08333333333333) - 0.101321910228769 * (0.076923076923077 * neural.NumberOfFloors - 1.07692307692308) + 0.034029228855677 * (0.000002000002 * neural.District - 1.000002000002) + 0.076809821348127 * (0.026315789473684 * neural.Year - 52.1052631578947) - 0.699888227409553 * (0.000020000200002 * neural.Walls - 1.0000200002) - 0.00499043101758 * (0.347826086956522 * neural.RefinancingRate - 3.52173913043478) - 0.131839283186807 * (0.000169277776367 * neural.AverageSalary - 3.50092679582561) + 0.001280200896459 * (0.000036317216358 * neural.Gdp - 2.4093694786482) - 0.405576867724982 * (0.001325240531156 * neural.Rts - 1.70905669378992) - 0.194073580766551 * (0.036639095747117 * neural.DollarPrice - 1.85544594359411) + 0.013492550400878 * (0.00053668713993 * neural.BrentPrice - 1.96020126476174) - 0.012010612994862 * (0.006060606060606 * neural.EstateBuilding - 2.21212121212121) + 0.034067734280239 * (0.047744091668656 * neural.CreditsAmount - 1.21532585342564) + 0.433313237705689) + 0.679562151488764 * Math.Tanh(1.1122917164382 * (0.017873100983021 * neural.LivingArea - 1.16264521894549) + 0.788816353914969 * (0.042826552462527 * neural.KitchenArea - 1.09850107066381) + 0.399191938981864 * (0.5 * neural.NumberOfRooms - 1.5) - 0.212247106736849 * (0.083333333333333 * neural.Floor - 1.08333333333333) - 0.038632876140608 * (0.076923076923077 * neural.NumberOfFloors - 1.07692307692308) - 0.107325941907957 * (0.000002000002 * neural.District - 1.000002000002) + 0.067201434039845 * (0.026315789473684 * neural.Year - 52.1052631578947) + 1.38703903611459 * (0.000020000200002 * neural.Walls - 1.0000200002) + 0.215747037484665 * (0.347826086956522 * neural.RefinancingRate - 3.52173913043478) - 0.065818910100465 * (0.000169277776367 * neural.AverageSalary - 3.50092679582561) + 0.109002734618531 * (0.000036317216358 * neural.Gdp - 2.4093694786482) - 0.824560971008657 * (0.001325240531156 * neural.Rts - 1.70905669378992) - 0.588573558244476 * (0.036639095747117 * neural.DollarPrice - 1.85544594359411) + 0.275213521496948 * (0.00053668713993 * neural.BrentPrice - 1.96020126476174) - 0.150362986962173 * (0.006060606060606 * neural.EstateBuilding - 2.21212121212121) - 0.011957459735183 * (0.047744091668656 * neural.CreditsAmount - 1.21532585342564) + 0.357127706110217) + 0.356581468529908 * Math.Tanh(-0.438973936371311 * (0.017873100983021 * neural.LivingArea - 1.16264521894549) - 0.509923353286903 * (0.042826552462527 * neural.KitchenArea - 1.09850107066381) - 0.638174892554688 * (0.5 * neural.NumberOfRooms - 1.5) + 0.170411887756064 * (0.083333333333333 * neural.Floor - 1.08333333333333) + 0.908760084665099 * (0.076923076923077 * neural.NumberOfFloors - 1.07692307692308) + 1.79220836686863 * (0.000002000002 * neural.District - 1.000002000002) + 0.105713795782659 * (0.026315789473684 * neural.Year - 52.1052631578947) - 0.179016259050152 * (0.000020000200002 * neural.Walls - 1.0000200002) - 0.32883921128617 * (0.347826086956522 * neural.RefinancingRate - 3.52173913043478) + 0.675042030236623 * (0.000169277776367 * neural.AverageSalary - 3.50092679582561) + 0.854189398682337 * (0.000036317216358 * neural.Gdp - 2.4093694786482) + 1.83611860763225 * (0.001325240531156 * neural.Rts - 1.70905669378992) + 0.813710587621727 * (0.036639095747117 * neural.DollarPrice - 1.85544594359411) - 0.183647009907475 * (0.00053668713993 * neural.BrentPrice - 1.96020126476174) + 0.129196437452635 * (0.006060606060606 * neural.EstateBuilding - 2.21212121212121) - 0.774650416943394 * (0.047744091668656 * neural.CreditsAmount - 1.21532585342564) + 0.862913970557829) - 0.564702912004453) + 1.11310541575502) / 0.000000152460708;

            result = Math.Abs(result);

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