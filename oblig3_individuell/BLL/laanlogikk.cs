using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using Model;

namespace BLL
{
    public class laanlogikk
    {
        private Dblogikk logikk;
        public laanlogikk()
        {
            logikk = new Dblogikk();
        }

        public List<Modell_soknad> hent_soknader()
        {
            var hentet = logikk.hent_soknad();

            return hentet;
        }
        public Boolean legg_soknad(Modell_soknad m)
        {
            if(logikk.Legg_soknad(m))
            {
                return true;
            }
            return false;
        }

    }
}
