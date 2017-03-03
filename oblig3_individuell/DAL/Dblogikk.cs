using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using static DAL.db_context;
using System.Globalization;

namespace DAL
{

    public class Dblogikk
    {

        public List<Modell_soknad> hent_soknad()
        {
            using (var db = new db_context())
            {
                var liste = db.soknader;
                var hentet = new List<Modell_soknad>();
                foreach (var sok in liste)
                {
                    string k = Convert.ToString(sok.sumPrMnd);
                    string r = Convert.ToString(sok.rentefot);
                    string g = Convert.ToString(sok.grunnbelop);
                    string aa = Convert.ToString(sok.aar);
                    Modell_soknad m = new Modell_soknad {
                        id = sok.id,
                        sumPrMnd = k,
                        rentefot = r,
                        grunnbelop = g,
                        aar = aa,
                        personnr = sok.personnr,
                        telefon = sok.telefon,
                        epost = sok.epost
                    };
                    hentet.Add(m);
                }
                return hentet;
            }
        }
        public Boolean Legg_soknad(Modell_soknad m)
        {

            using (var db = new db_context())
            {
                try
                {
                    double k = double.Parse(m.sumPrMnd, CultureInfo.InvariantCulture);
                    double r = double.Parse(m.rentefot, CultureInfo.InvariantCulture);
                    int g = Convert.ToInt32(m.grunnbelop);
                    int aa = Convert.ToInt32(m.aar);
                    soknad s = new soknad
                    {
                        sumPrMnd = k,
                        rentefot = r,
                        grunnbelop = g,
                        aar = aa,
                        personnr = m.personnr,
                        telefon = m.telefon,
                        epost = m.epost

                    };
                
                        db.soknader.Add(s);
                        db.SaveChanges();
                        return true;
                }
                catch
                {
                    return false;
                }
                
            }
                
        }
    }
}
