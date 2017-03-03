using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class db_context : DbContext
    {
        public db_context() : base("name=kobling")
        {

            if (Database.CreateIfNotExists())//lager databasen. gir mulighet til å legge inn metoder
            {
            }
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingEntitySetNameConvention>();
        }
        public DbSet<soknad> soknader { get; set; }

        public class soknad
        {
            public int id { get; set; }
            public double sumPrMnd { get; set; }//y = kostnadene per år for lånet(som da må deles på 12 for å få månedsbeløpet)
            public double rentefot { get; set; }// r = rentefoten i desimal tall(altså 0,07 i dette tilfelle)
            public int grunnbelop { get; set; }// G = Grunnbeløpet som ønskes lånt
            public int aar { get; set; }//n = antall år man ønsker å nedbetale lånet*/

            public string personnr { get; set; }
            public string telefon { get; set; }
            public string epost { get; set; }
        }

    }//end class
}
