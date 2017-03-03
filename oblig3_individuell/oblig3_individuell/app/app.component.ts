import {Component, OnInit} from '@angular/core';
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import "rxjs/add/operator/map";
import {Laan} from "./laan";
import {Headers} from "@angular/http";


@Component({
    selector: 'my-app',
    templateUrl: "./app/app.component.html"
})
export class AppComponent {
//Variabler som brukes til navigering, registrering og sjekkinger
    visKalkulator: boolean;
    visRegForm: boolean;
    visListe: boolean;
    skjema: FormGroup;
    laan: Laan;
    liste: Array<Laan>;
    Pnummer: Array<string>;
    skjemaStatus: string;
    personnrSjekk: boolean;

    constructor(private _http: Http, private fb: FormBuilder) {
        this.laan = new Laan();
        this.resetform();
    }
    ngOnInit() {/*gjøres hver gang man åpner siden. vil sende deg til kalkulatorsiden og hente alle søknader for vis søknad.*/
        this.visKalkulator = true;
        this.visRegForm = false;
        this.visListe = false;
        this.hent_soknader(); //henter opp søknader tidligere

        this.standardVerdier(); //setter på standardverdier til kalkulator
         
        
    }
    resetform() { //metoden brukes til å resette skjemaet. slik at når en bruker er registrert, så er også inputfeltene urørt.
        this.skjema = this.fb.group({
            belop: [""],
            nedbetaling: [""],
            perMnd: [""],
            rente: [""],
            personnr: ["", Validators.pattern("[0-9]{11}")],
            telefon: ["", Validators.pattern("[0-9]{8}")],
            epost: ["", Validators.pattern("[\\w\\.\\-\\_]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}")]
        });

    }
    standardVerdier() { //gjør om verdiene i kalkulator til standard
        this.laan.grunnbelop = "20000";
        this.laan.aar = "5";
        this.laan.sumPrMnd = this.beregnLaan();

    }
    sjekkPersonnr() { //sjekker om personnummer har blitt skrevet før

        var sjekk = jQuery.inArray($('#Persnummer').val(), this.Pnummer);
        if (sjekk == -1) {
            this.personnrSjekk = false;
        }
        else {
            this.personnrSjekk = true;
        }
    }
    registrerlaan() {/*åpner reg lån siden*/
        this.laan.grunnbelop = $('#myRange').val();
        this.laan.aar = $('#myRangeYear').val();;
        this.laan.sumPrMnd = $('#prisPerM').html();
        this.laan.rentefot = $('#rentelaan').html();
        this.resetform();
        this.skjemaStatus = "Registrere";
        this.visKalkulator = false;
        this.visListe = false;
        this.visRegForm = true;
        this.skjema.patchValue({ personnr: "" });
        
        this.skjema.patchValue({ telefon: "" });
        this.skjema.patchValue({ epost: "" });
    }
    vislaanListe() { /*viser hvem som er registrert*/
        this.visKalkulator = false;
        this.visListe = true;
        this.visRegForm = false;
    }
    kalkulatorside() {/*åpner reg lån siden*/
        this.visListe = false;
        this.visRegForm = false;
        this.visKalkulator = true;
    }
    verdi() { /*viser ønsket lån*/
        var verdi = $('#myRange').val();
        
        this.laan.grunnbelop = verdi;
        var text = this.beregnLaan();
        this.laan.sumPrMnd = text;
        
    }
    verdiaar() { /*viser hvor mange år de ønsker*/
        var verdi = $('#myRangeYear').val();
        
        this.laan.aar = verdi;
        var text = this.beregnLaan();
        this.laan.sumPrMnd = text;
    }
    beregnLaan() { /*beregner lånet*/
        var r = 0.07; //rente
        var G = this.laan.grunnbelop; //grunnbeløp
        var n = this.laan.aar; // antall år
        var x = (r * +G); //utregner lånebeløp i måned
        var z = 1 - Math.pow((1 + r), -n);
        var y = (x / z)/12;
        
        var text = y.toFixed(2);
        return text;
    }
    hent_soknader() {/*Metoden henter alle søknader ved å gå inn i apikontroller*/
        this._http.get("api/laan/")
            .map(returData => {
                let JsonData = returData.json();
                return JsonData;
            })
            .subscribe(
            JsonData => {
                this.liste = [];
                this.Pnummer = [];
                if (JsonData) {
                    for (let soknad of JsonData) {
                        this.liste.push(soknad);
                        this.Pnummer.push(soknad.personnr);
                    }
                };
            },
            error => alert(error),
            () => console.log("ferdig med å hente søknader!")
            );
    }

    lagreSoknad() {/*lagrer søknaden*/
        $("#vente").html("vennligst vent...");
        var laanet = new Laan();
        laanet.sumPrMnd = this.laan.sumPrMnd;
        laanet.rentefot = this.laan.rentefot;
        laanet.grunnbelop = this.laan.grunnbelop;
        laanet.aar = this.laan.aar;
        laanet.personnr = this.skjema.value.personnr;
        laanet.telefon = this.skjema.value.telefon;
        laanet.epost = this.skjema.value.epost;
        var body: string = JSON.stringify(laanet);
        var headers = new Headers({ "Content-Type": "application/json" });
        this._http.post("api/laan", body, { headers: headers })
            .map(returData => returData.toString())
            .subscribe(
            retur => {
                $('#Moverskrift').html("Takk for registrering"); //modal får text
                $("#textbeststill").html("Søknaden er registrert. vi vil ta kontakt så snart søknaden er behandlet!");
                this.hent_soknader();
                this.visKalkulator = true;
                this.visListe = false;
                this.visRegForm = false;
                this.standardVerdier();
            },
            error => { /*Om det ikke gikk, vil denne endre teksten i modal*/
                $('#Moverskrift').html("Error");
                $("#textbeststill").html("feil i registrering. søknad ikke registrert!");
                this.kalkulatorside();

            },
            () => console.log("ferdig med å lagre søknad!")
            );
    }

    vedSubmit() {

        if (this.skjemaStatus == "Registrere") {
            this.lagreSoknad();
        }
        else if (this.skjemaStatus == "Endre") {
        }
        else {
            alert("Feil i applikasjonen!");
        }

    }


    fjern() {
        this.kalkulatorside();

        $("#laanbelop").html(this.laan.grunnbelop);


    }

    
}
