using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ocenka_management.Models
{
    public class AddresDataAccess
{
        OcenkaManagementContext cont = new OcenkaManagementContext();

        public IEnumerable<AddressSet> Addreses()
        {
            return cont.AddressSet.OrderBy(c => c.City);
        }

        public AddressSet GetAddress(int id)
        {
            return cont.AddressSet.SingleOrDefault(c => c.Id == id);
        }

        public AddressSet AddAddress(string city, string district, string street, int house, int numberofflat)
        {
            AddressSet c = new AddressSet();
            c.City = city;
            c.District = district;
            c.Street = street;
            c.House = house;
            c.NumberOfFlat = numberofflat;
            cont.AddressSet.Add(c);
            cont.SaveChanges();
            return c;
        }

        public void DeleteAddress(int id)
        {
            AddressSet c = cont.AddressSet.Find(id);
            cont.AddressSet.Remove(c);
            cont.SaveChanges();
        }

        public void EditAddress(int id, string city, string district, string street, int house, int numberofflat)
        {
            AddressSet c = cont.AddressSet.Find(id);
            c.City = city;
            c.District = district;
            c.Street = street;
            c.House = house;
            c.NumberOfFlat = numberofflat;
            cont.SaveChanges();
        }

        public int FindAddress(string city, string district, string street, int house, int numberofflat)
        {
            if ((city != "") && (district != "") && (street != ""))
            {
                foreach (AddressSet a in cont.AddressSet)
                {
                    if ((a.City == city) && (a.District == district) && (a.Street == street) && (a.House == house) && (a.NumberOfFlat == numberofflat))
                    {
                        return a.Id;
                    }
                }
            }
            return -1;
        }
    }
}
