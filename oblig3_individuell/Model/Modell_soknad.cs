using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class Modell_soknad
    {
        public int id { get; set; }
        //trenger ikke regex fordi du kan bruke de andre verdiene til å sjekke om det stemmer.
        [Required]
        [RegularExpression(@"^[1-9]{1}([0-9]{1,4})\.[0-9][0-9]$")]
        public string sumPrMnd { get; set; }//y = kostnadene per år for lånet(som da må deles på 12 for å få månedsbeløpet)
        [Required]
        [RegularExpression(@"^[7]$")]
        public string rentefot { get; set; }// r = rentefoten i desimal tall(altså 0,07 i dette tilfelle)
        [Required]
        [RegularExpression(@"^([1-9]{1}[0-9]{0,2})[0,5][0][0][0]$")]
        public string grunnbelop { get; set; }// G = Grunnbeløpet som ønskes lånt
        [Required]
        [RegularExpression(@"^[3-9]|[1][0-5]$")]
        public string aar { get; set; }//n = antall år man ønsker å nedbetale lånet*/
        [Required]
        [RegularExpression(@"^[0-9]{11}$")]
        public string personnr { get; set; }
        [Required]
        [RegularExpression(@"^[0-9]{8}$")]
        public string telefon { get; set; }
        [Required]
        [RegularExpression(@"^[\w._-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$")]
        public string epost { get; set;}
    }
}
