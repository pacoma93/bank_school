using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using BLL;
using System.Text;
using Model;

namespace oblig3_individuell.Controllers
{
    public class laanController : ApiController
    {

        private laanlogikk logikk = new laanlogikk();

        public HttpResponseMessage Get()
        {
            var liste = logikk.hent_soknader();
            var json = new JavaScriptSerializer();
            String JsonString = json.Serialize(liste);
            return new HttpResponseMessage()
            {
                Content = new StringContent(JsonString, Encoding.UTF8, "application/json"),
                StatusCode = HttpStatusCode.OK
            };
        }

        [HttpPost]
        public HttpResponseMessage Post([FromBody]Modell_soknad innsoknad)
        {
            if(ModelState.IsValid)
            {
                if (logikk.legg_soknad(innsoknad))
                {
                    return new HttpResponseMessage()
                    {
                        StatusCode = HttpStatusCode.OK
                    };

                }
            }
            
            return new HttpResponseMessage()
            {
                StatusCode = HttpStatusCode.BadRequest,
                Content = new StringContent("Kunne ikke sette inn søknad i DB")
            };


        }
    }
}
